#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INPUT_FILE="$SCRIPT_DIR/audio/netflix_profile_click.mp3"
OUTPUT_FILE="$SCRIPT_DIR/audio/netflix_profile_click_cropped.mp3"

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "ffmpeg is required but not installed."
  exit 1
fi

if [[ ! -f "$INPUT_FILE" ]]; then
  echo "Input file not found: $INPUT_FILE"
  exit 1
fi

ffmpeg -y -ss 0.5 -i "$INPUT_FILE" -c:a libmp3lame -q:a 2 "$OUTPUT_FILE"
echo "Cropped audio written to: $OUTPUT_FILE"
