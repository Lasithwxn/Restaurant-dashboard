/**
 * Supabase Client Initialization
 * Centralized Supabase configuration and client setup
 */

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
  console.error('Required variables: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY');
}

/**
 * Extract project ID from URL
 */
export const projectId = supabaseUrl.split('://')[1]?.split('.')[0] || '';

export const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${supabaseAnonKey}`,
});

/**
 * Health check to verify backend connectivity
 */
export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const endpoint = `${supabaseUrl}/functions/v1/make-server-5c1c75e3/health`;
    console.log('Checking backend health at:', endpoint);
    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: getHeaders(),
    });
    
    console.log('Health check response:', response.status);
    return response.ok;
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
};

