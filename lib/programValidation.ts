export const PROGRAM_TEXT_INPUT_REGEX = /^[A-Za-z0-9 .,'&()\/\-]*$/;

export const PROGRAM_TEXT_INPUT_PATTERN = "[A-Za-z0-9 .,'&()\\/-]*";

export const PROGRAM_TEXT_AREA_REGEX = /^[A-Za-z0-9 .,'&()\/\-;\n]*$/;

export const PROGRAM_TEXT_INPUT_MESSAGE =
  "Only letters, numbers, spaces, and . , ' & ( ) - / characters are allowed.";

const PROGRAM_TEXT_INPUT_STRIP_REGEX = /[^A-Za-z0-9 .,'&()\/\-]/g;

const PROGRAM_TEXT_AREA_STRIP_REGEX = /[^A-Za-z0-9 .,'&()\/\-;\n]/g;

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
