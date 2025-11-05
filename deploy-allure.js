import { execSync } from 'child_process';

try {
    console.log('🧪 Running Playwright tests...');
    execSync('npx playwright test', { stdio: 'inherit' });

    console.log('📊 Generating Allure report...');
    execSync('npx allure generate allure-results -o allure-report --clean', { stdio: 'inherit' });

    console.log('🚀 Deploying report to Netlify...');
    execSync('netlify deploy --dir=allure-report --prod', { stdio: 'inherit' });

    console.log('✅ Deployment complete!');
} catch (error) {
    console.error('❌ Error during deployment:', error.message);
    process.exit(1);
}
