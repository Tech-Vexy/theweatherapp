import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    typescript: {
        ignoreBuildErrors: true
    },
    eslint: {
        ignoreDuringBuilds: true
    },
    images: {
        domains: [
            'images.unsplash.com',
            'openweathermap.org',
            'c02.purpledshub.com',
            'dims.apnews.com',
            'cdn.vox-cdn.com',
            'cff2.earth.com',
            'www.reuters.com',
            'www.washingtonpost.com',
            'static.files.bbci.co.uk',
            'minnesotareformer.com',
            'sportshub.cbsistatic.com',
            's.yimg.com',
        ]
    }
};

export default nextConfig;