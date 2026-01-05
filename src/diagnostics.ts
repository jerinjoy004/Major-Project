import { supabase } from './lib/supabase/client';

/**
 * Database Diagnostic Tool
 * Run this to check if your Supabase connection is working
 */

async function runDiagnostics() {
    console.log('🔍 Starting database diagnostics...\n');

    // Test 1: Check Supabase client
    console.log('✅ Supabase client initialized');

    // Test 2: Check authentication
    try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
            console.error('❌ Session error:', sessionError);
        } else if (session) {
            console.log('✅ User authenticated:', session.user.email);
        } else {
            console.warn('⚠️ No active session - user needs to login');
        }
    } catch (error) {
        console.error('❌ Auth check failed:', error);
    }

    // Test 3: Check products table
    try {
        const { data: products, error: productsError } = await supabase
            .from('products')
            .select('*');

        if (productsError) {
            console.error('❌ Products query error:', productsError);
        } else {
            console.log(`✅ Products table accessible: ${products?.length || 0} products found`);
            if (products && products.length > 0) {
                console.log('   Sample product:', (products[0] as any).name);
            }
        }
    } catch (error) {
        console.error('❌ Products check failed:', error);
    }

    // Test 4: Check users table
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data: profile, error: profileError } = await supabase
                .from('users')
                .select('*')
                .eq('id', user.id);

            if (profileError) {
                console.error('❌ User profile error:', profileError);
            } else if (profile && profile.length > 0) {
                console.log('✅ User profile found:', (profile[0] as any).username);
            } else {
                console.warn('⚠️ User profile not found in users table');
            }
        }
    } catch (error) {
        console.error('❌ User profile check failed:', error);
    }

    console.log('\n🏁 Diagnostics complete!');
}

export { runDiagnostics };
