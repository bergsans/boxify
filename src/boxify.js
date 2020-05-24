const HEAD = 0;
const fmtLn = (ln, w) => `║ ${ln}${' '.repeat(w - ln.length)} ║`;
const fmtLns = (arr, w) => arr.map((ln) => fmtLn(ln, w));
const isLonger = (a, b) => b.length - a.length;
const longestLnLenOf = (lns) =>  [...lns].sort(isLonger)[HEAD].length;
const topLn = (w) => `╔${'═'.repeat(w + 2)}╗`;
const bottomLn = (w) => `╚${'═'.repeat(w + 2)}╝`;

module.exports = plugin => {
  async function boxify() {
    const { nvim } = await plugin;
    const { buffer } = await nvim;
    const [, sl,] = await nvim.call('getpos', true ? `'<` : `'[`); 
    const [, el,] = await nvim.call('getpos', true ? `'>` : `']`);
    const lns = await buffer.getLines({
      start: sl - 1,
      end: el,
    });
    const longestLn = longestLnLenOf(lns);
    const newLines = fmtLns(lns, longestLn);
    await plugin.nvim.buffer.setLines(newLines, {
      start: sl - 1,
      end: el,
      strictIndexing: true,
    });
    await buffer.insert(topLn(longestLn), sl - 1);
    await buffer.insert(bottomLn(longestLn), el + 1);
  }

  plugin.registerCommand('Boxify', boxify, {
    sync: false,
    range: '',
  });
};
