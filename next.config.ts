import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
	eslint: {
		ignoreDuringBuilds: true,
	},
	output: 'export',
	distDir: 'out',
};

export default nextConfig;
