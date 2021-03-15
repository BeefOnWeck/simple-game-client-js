module.exports = {
  pages: {
    tic_tac_toe: {
      entry: 'src/games/tic-tac-toe/main.js',
      template: 'public/index.html',
      title: 'Tic Tac Toe',
      filename: "tic-tac-toe.html",
      chunks: ['chunk-vendors', 'chunk-common', 'tic_tac_toe']
    }
  }
}