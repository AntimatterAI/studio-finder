import { supabase } from './supabase'

/**
 * Promote a user to admin status
 * This function should only be called by existing admins or during initial setup
 */
export async function promoteUserToAdmin(userEmail: string): Promise<{ success: boolean; message: string }> {
  try {
    // Call the database function to promote user
    const { data, error } = await supabase
      .rpc('promote_to_admin', { user_email: userEmail })

    if (error) {
      console.error('Error promoting user to admin:', error)
      return { 
        success: false, 
        message: `Database error: ${error.message}` 
      }
    }

    if (data === true) {
      return { 
        success: true, 
        message: `Successfully promoted ${userEmail} to admin` 
      }
    } else {
      return { 
        success: false, 
        message: `User with email ${userEmail} not found` 
      }
    }
  } catch (error) {
    console.error('Error in promoteUserToAdmin:', error)
    return { 
      success: false, 
      message: 'An unexpected error occurred' 
    }
  }
}

/**
 * Check if a user is an admin
 */
export async function isUserAdmin(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .rpc('is_admin', { user_id: userId })

    if (error) {
      console.error('Error checking admin status:', error)
      return false
    }

    return data === true
  } catch (error) {
    console.error('Error in isUserAdmin:', error)
    return false
  }
}

/**
 * Get current user's admin status
 */
export async function getCurrentUserAdminStatus(): Promise<boolean> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return false
    }

    return await isUserAdmin(user.id)
  } catch (error) {
    console.error('Error getting current user admin status:', error)
    return false
  }
}

/**
 * Console command to promote a user to admin
 * Usage: Run this in browser console after logging in
 */
export function makeUserAdmin(userEmail: string) {
  console.log(`Attempting to promote ${userEmail} to admin...`)
  
  promoteUserToAdmin(userEmail).then(result => {
    if (result.success) {
      console.log(`✅ ${result.message}`)
      console.log('The user is now an admin and can access /admin')
    } else {
      console.error(`❌ ${result.message}`)
      console.log('💡 Tip: Make sure the user has registered an account first at /register')
    }
  }).catch(error => {
    console.error('❌ Failed to promote user:', error)
  })
}

/**
 * Console command to create and setup first admin account
 * Usage: Run this in browser console
 */
export function setupFirstAdmin(userEmail: string, password: string) {
  console.log(`🚀 Setting up first admin account for ${userEmail}...`)
  
  supabase.auth.signUp({
    email: userEmail,
    password: password,
    options: {
      data: {
        role: 'admin',
        tier_level: 3,
        registration_mode: 'admin_setup'
      }
    }
  }).then(({ data, error }) => {
    if (error) {
      console.error('❌ Failed to create account:', error.message)
      if (error.message.includes('already registered')) {
        console.log('💡 Account already exists. Try logging in instead.')
      }
      return
    }
    
    if (data.user) {
      console.log('✅ Account created successfully!')
      console.log('📧 Check your email for confirmation (if required)')
      console.log('🔑 You can now login at /admin/login')
      
      // The admin promotion will happen automatically due to database setup
      setTimeout(() => {
        console.log('✅ Admin setup complete! You can now access /admin')
      }, 1000)
    }
  }).catch(error => {
    console.error('❌ Setup failed:', error)
  })
}

// Make the functions available globally for console use
if (typeof window !== 'undefined') {
  (window as unknown as Record<string, unknown>).makeUserAdmin = makeUserAdmin;
  (window as unknown as Record<string, unknown>).setupFirstAdmin = setupFirstAdmin
} 