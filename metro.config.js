const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for SVG files
config.transformer.assetPlugins = ['expo-asset/tools/hashAssetFiles'];

// Resolve react-native-maps only for native platforms
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

// Platform-specific extensions
config.resolver.sourceExts = [...config.resolver.sourceExts, 'svg'];

module.exports = config;