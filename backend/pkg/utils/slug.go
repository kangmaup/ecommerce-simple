package utils

import (
	"regexp"
	"strings"
)

func MakeSlug(s string) string {
	// Convert to lower case
	s = strings.ToLower(s)
	// Replace non-alphanumeric characters with hyphens
	reg := regexp.MustCompile("[^a-z0-9]+")
	s = reg.ReplaceAllString(s, "-")
	// Trim hyphens from start and end
	s = strings.Trim(s, "-")
	return s
}
