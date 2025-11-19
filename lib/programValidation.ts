export const PROGRAM_TEXT_INPUT_REGEX = /^[A-Za-z0-9 .,'\"!?\-:;\/\\&=?#@%()[\]{}~+_]*$/;

export const PROGRAM_TEXT_INPUT_PATTERN = "[A-Za-z0-9 .,'\"!?\\-:;/\\\\&=?#@%()[\\]{}~+_]*";

export const PROGRAM_TEXT_AREA_REGEX = /^[A-Za-z0-9 .,'\"!?\-:;\/\\&=?#@%()[\]{}~+_\n]*$/;

export const PROGRAM_TEXT_INPUT_MESSAGE =
  "Most characters including URLs are allowed.";

const PROGRAM_TEXT_INPUT_STRIP_REGEX = /[^\w\s.,'\"!?\-:;\/\\&=?#@%()[\]{}~+]/g;

const PROGRAM_TEXT_AREA_STRIP_REGEX = /[^\w\s.,'\"!?\-:;\/\\&=?#@%()[\]{}~+\n]/g;

export const sanitizeProgramText = (
  value: string,
  { allowNewLines = false }: { allowNewLines?: boolean } = {}
) =>
  value.replace(
    allowNewLines
      ? PROGRAM_TEXT_AREA_STRIP_REGEX
      : PROGRAM_TEXT_INPUT_STRIP_REGEX,
    ""
  );
