
export const uncomment = () => {
  return {
    name: "uncomment",
    renderChunk: (code: string, info: any) => {
      code = code.replaceAll(/\n?\/\/.*?\n/g, "");
      return { code, info };
    }
  };
};

export const removeImport = (value: string[]) => {
  return {
    name: "removeImport",
    renderChunk: (code: string, info: any) => {
      value.forEach(p => {
        if (p) {
          code = code.replaceAll(new RegExp(`var.*?require.*?${p}.*?;\n`, "g"), "");
        }
      });
      return { code, info };
    }
  };
};

export const removeConditionJudgment = () => {
  return {
    name: "removeConditionJudgment",
    renderChunk: (code: string, info: any) => {
      code = code.replaceAll(/if\s*?\(false\)\s*?\{[\s\S]*?\}/g, "");
      return { code, info };
    }
  };
};