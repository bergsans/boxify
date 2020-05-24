const HEAD = 0;
const fmtLn = (ln, w) => `║ ${ln}${' '.repeat(w - ln.length)} ║`;
const fmtLns = (arr, w) => arr.map((ln) => fmtLn(ln, w));
const isLonger = (a, b) => b.length - a.length;
const longestLnLenOf = (lns) =>  [...lns].sort(isLonger)[HEAD].length;
const topLn = (w) => `╔${'═'.repeat(w + 2)}╗`;
const bottomLn = (w) => `╚${'═'.repeat(w + 2)}╝`;

module.exports = plugin => {
  async function boxify() {
    const { nvim } =  await plugin;
    const { buffer } =  await nvim;
    const [, startLn,] =  await nvim.call('getpos', `'<`); 
    const [, end,] =  await nvim.call('getpos', `'>`);
    const start = startLn - 1;
    const lns =  await buffer.getLines({ start, end });
    const longestLn = longestLnLenOf(lns);
    const formattedLines = fmtLns(lns, longestLn);
    await buffer.setLines(formattedLines, { start, end, strictIndexing: true, });
    await buffer.insert(topLn(longestLn), start);
    await buffer.insert(bottomLn(longestLn), end + 1);
  }

  plugin.registerCommand('Boxify', boxify, {
    sync: false,
    range: '',
  });
};
