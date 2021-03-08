module.exports = {
  pages: {
    cards_test: {
      entry: 'src/games/cards-test/app.js',
      template: 'public/index.html',
      title: 'Cards Test',
      filename: "cards-test.html",
      chunks: ['chunk-vendors', 'chunk-common', 'cards_test']
    }
  }
}