/**
 * Utility function to add a test ID to an element.
 * - Ensures the test ID is kebab-case (lowercase with hyphens).
 * - Ensures the test ID has between 1 and 4 words (e.g., "my-id", "one-two-three-four").
 *
 * @param id - The test ID value to assign.
 * @returns An object containing the test ID attribute.
 * @throws Error if the test ID is invalid.
 */
export function tId(id: string): { "data-testid": string } {
  const formattedId = id.trim();

  // Regex explanation:
  // ^[a-z]+(-[a-z]+){0,3}$
  // - ^ and $: start and end anchors
  // - [a-z]+: one or more lowercase letters (the first word)
  // - (-[a-z]+){0,3}: zero to three additional words prefixed by a hyphen
  // This allows 1 to 4 words total.
  const kebabCasePattern = /^[a-z]+(-[a-z]+){0,3}$/;

  if (!kebabCasePattern.test(formattedId)) {
    throw new Error(
      `Invalid test ID "${formattedId}". It must be kebab-case and consist of 1 to 4 words (e.g.,"one-two-three-four").`
    );
  }

  return { "data-testid": formattedId };
}
