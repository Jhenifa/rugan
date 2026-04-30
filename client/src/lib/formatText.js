/**
 * Parse markdown-style bold (**text**) and italic (*text*) markers
 * into React elements. Returns an array of strings and React elements.
 */
import React from "react";

export function parseFormattedText(text) {
  if (!text) return text;
  // Match **bold** and *italic* patterns
  const parts = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // Try bold first (**...**)
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    // Try italic (*...*)
    const italicMatch = remaining.match(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/);

    let firstMatch = null;
    let matchType = null;

    if (boldMatch && italicMatch) {
      if (boldMatch.index <= italicMatch.index) {
        firstMatch = boldMatch;
        matchType = "bold";
      } else {
        firstMatch = italicMatch;
        matchType = "italic";
      }
    } else if (boldMatch) {
      firstMatch = boldMatch;
      matchType = "bold";
    } else if (italicMatch) {
      firstMatch = italicMatch;
      matchType = "italic";
    }

    if (!firstMatch) {
      parts.push(remaining);
      break;
    }

    // Add text before the match
    if (firstMatch.index > 0) {
      parts.push(remaining.slice(0, firstMatch.index));
    }

    // Add formatted element
    if (matchType === "bold") {
      parts.push(React.createElement("strong", { key: key++ }, firstMatch[1]));
    } else {
      parts.push(React.createElement("em", { key: key++ }, firstMatch[1]));
    }

    remaining = remaining.slice(firstMatch.index + firstMatch[0].length);
  }

  return parts.length === 1 && typeof parts[0] === "string" ? parts[0] : parts;
}
