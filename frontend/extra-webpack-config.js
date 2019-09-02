const { styles } = require( '@ckeditor/ckeditor5-dev-utils' );

module.exports = {
  module: {
    rules: [
      {
        test: /\.svg$/,
        use: [ 'raw-loader' ]
      },
      {
        test: /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css/,
        use: [
          {
            loader: 'style-loader',
            options: {
              singleton: true
            }
          },
          {
            loader: 'postcss-loader',
            options: styles.getPostCssConfig( {
              themeImporter: {
                themePath: require.resolve( '@ckeditor/ckeditor5-theme-lark' )
              },
              minify: true
            } )
          }
        ]
      },
      {
        test: /\.ts$/,
        exclude: /\.(spec|e2e)\.ts$/,
        use: [
          'awesome-typescript-loader',
          'angular2-template-loader'
        ],
      },
      {
        test: /\.css/,
        exclude: /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css/,
        use: 'raw-loader'
      },
      {
        test: /\.html/,
        use: [
          'html-loader'
        ]
      }
    ]
  }
}