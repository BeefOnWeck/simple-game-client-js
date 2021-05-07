module.exports = {
  pages: {
    tic_tac_toe: {
      entry: 'src/games/tic-tac-toe/main.js',
      template: 'public/index.html',
      title: 'Tic Tac Toe',
      filename: "tic-tac-toe.html",
      chunks: ['chunk-vendors', 'chunk-common', 'tic_tac_toe']
    },
    blackjack: {
      entry: 'src/games/blackjack/main.js',
      template: 'public/index.html',
      title: 'blackjack',
      filename: "blackjack.html",
      chunks: ['chunk-vendors', 'chunk-common', 'blackjack']
    },
    hexagon: {
      entry: 'src/games/hexagon-island/main.js',
      template: 'public/index.html',
      title: 'hexagon',
      filename: "hexagon-island.html",
      chunks: ['chunk-vendors', 'chunk-common', 'hexagon']
    }
  }
}