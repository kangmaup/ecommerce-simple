package service

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/user/go-ecommerce/internal/domain"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type orderService struct {
	repo        domain.OrderRepository
	cartRepo    domain.CartRepository
	productRepo domain.ProductRepository
	db          *gorm.DB // Needed for transaction
}

type OrderService interface {
	Checkout(ctx context.Context, userID uuid.UUID) (*domain.Order, error)
	GetMyOrders(ctx context.Context, userID uuid.UUID) ([]domain.Order, error)
	GetAllOrders(ctx context.Context) ([]domain.Order, error)
}

func NewOrderService(repo domain.OrderRepository, cartRepo domain.CartRepository, productRepo domain.ProductRepository, db *gorm.DB) OrderService {
	return &orderService{
		repo:        repo,
		cartRepo:    cartRepo,
		productRepo: productRepo,
		db:          db,
	}
}

func (s *orderService) Checkout(ctx context.Context, userID uuid.UUID) (*domain.Order, error) {
	// 1. Get Cart
	cart, err := s.cartRepo.FindBytesUserID(ctx, userID)
	if err != nil {
		return nil, err
	}
	if cart == nil || len(cart.Items) == 0 {
		return nil, errors.New("cart is empty")
	}

	// Start Transaction
	tx := s.db.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	if tx.Error != nil {
		return nil, tx.Error
	}

	// Use tx context for all DB operations within transaction
	// txCtx := context.WithValue(ctx, "tx", tx) 
	// we would typically use `tx` to create new instances of repos. 
	// However, since my repos store `db *gorm.DB`, I can't easily swap it per request unless I refactor.
	//
	// Workaround for MVP: Direct manipulation or updating Repos to accept Transaction injection.
	// BETTER APPROACH for MVP:
	// Use the `tx` object directly for updates here inside Service, OR
	// assume optimistic locking isn't critical for MVP and just do operations.
	// BUT, Stock Deduction MUST be atomic.
	//
	// Let's use `tx` to re-instantiate temporary repositories for this operation.
	// This is the cleanest way without changing global architecture.

	// Actually, best practice with current structure: 
	// passing `tx` to repo methods? No, interfaces don't have it.
	//
	// Quick fix: Do the logic directly here or rely on the fact that for MVP we might skip strict ACID if hard.
	// BUT Tokopedia quality needs ACID.
	//
	// Let's modify Respositories? No, too many files.
	// Let's use `db.Transaction` closure which passes `tx`.
	// And we need repositories to use THAT `tx`.
	//
	// If I cannot inject `tx` into existing simple repos, I have to execute raw GORM calls on `tx` here.
	// Or, I define a helper `WithTx(tx *gorm.DB) Repository` on the repo interface (Advanced).
	//
	// FASTEST VALID PATH:
	// Do logic inline with `tx`.

	var order *domain.Order
	
	err = s.db.Transaction(func(tx *gorm.DB) error {
		var totalAmount float64
		var orderItems []domain.OrderItem

		for _, cartItem := range cart.Items {
			// Lock User Product Row? (Optional)
			var product domain.Product
			if err := tx.Clauses(clause.Locking{Strength: "UPDATE"}).First(&product, cartItem.ProductID).Error; err != nil {
				return err 
			}

			if product.Stock < cartItem.Quantity {
				return errors.New("insufficient stock for product: " + product.Name)
			}

			// Deduct Stock
			product.Stock -= cartItem.Quantity
			if err := tx.Save(&product).Error; err != nil {
				return err
			}

			// Prepare Order Item
			totalAmount += float64(cartItem.Quantity) * product.Price
			orderItems = append(orderItems, domain.OrderItem{
				ProductID: product.ID,
				Quantity:  cartItem.Quantity,
				Price:     product.Price,
			})
		}

		// Create Order
		order = &domain.Order{
			UserID:      userID,
			TotalAmount: totalAmount,
			Status:      domain.OrderStatusPending,
			Items:       orderItems,
		}

		if err := tx.Create(order).Error; err != nil {
			return err
		}

		// Clear Cart
		if err := tx.Where("cart_id = ?", cart.ID).Delete(&domain.CartItem{}).Error; err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		return nil, err
	}

	return order, nil
}

func (s *orderService) GetMyOrders(ctx context.Context, userID uuid.UUID) ([]domain.Order, error) {
	return s.repo.FindAllByUserID(ctx, userID)
}

func (s *orderService) GetAllOrders(ctx context.Context) ([]domain.Order, error) {
	return s.repo.FindAll(ctx)
}
