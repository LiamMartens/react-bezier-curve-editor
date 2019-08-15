const fs = require('fs');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        writeToDisk: true
    },
    entry: {
        ...(isProduction ? {
            react: path.resolve(__dirname, 'src/react/index.tsx'),
        } : {
            dev: path.resolve(__dirname, 'src/dev/index.tsx')
        }),
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        ...(isProduction && ({
            library: 'ReactBezierCurveEditor',
            libraryTarget: 'umd'
        }))
    },
    ...(isProduction && ({
        externals: ['react', 'react-dom'],
    })),
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                loader: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            localIdentName: '[name]__[local]___[hash:base64:5]',
                            camelCase: true,
                            sourceMap: false,
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: false,
                        }
                    },
                    {
                        loader: 'sass-resources-loader',
                        options: {
                            resources: fs.readdirSync(path.join(__dirname, 'src/scss/resources')).map(file => (
                                path.join(__dirname, 'src/scss/resources', file)
                            ))
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        alias: {
            'src': path.join(__dirname, 'src'),
            'constants': path.join(__dirname, 'constants'),
        },
        extensions: ['.tsx', '.ts', '.js', '.scss']
    },
    plugins: [
        new FixStyleOnlyEntriesPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css'
        }),
        ...(isProduction ? [] : [new HtmlWebpackPlugin({
            title: 'React Bezier Curve Editor',
            filename: 'index.html',
            template: path.join(__dirname, 'src/index.html'),
        })]),
    ],
};