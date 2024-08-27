const path = require('path');

module.exports = {
    mode: 'development',  
    entry: './src/index.ts', 
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],  
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,  
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.scss$/,  // Handling SCSS files
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/,  // Handling images
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]',
                        },
                    },
                ],
            },
        ],
    },
};