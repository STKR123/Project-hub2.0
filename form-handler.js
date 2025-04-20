// Form submission handler for Google Forms to Supabase integration
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Supabase client
    const supabaseUrl = 'https://ajvonlwnhsnmwjcidukb.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqdm9ubHduaHNubXdqY2lkdWtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxODEwOTMsImV4cCI6MjA1OTc1NzA5M30.UZIAB1j2ZsKYNDLUrr08_NbzbLUzeuQWYacdaIcECz8';
    const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

    // Function to handle form submissions from Google Forms
    async function handleFormSubmission(formData) {
        try {
            // Extract data from the form submission
            const projectData = {
                department: formData.get('department'),
                year: parseInt(formData.get('year')),
                registration_number: formData.get('registration_number'),
                email: formData.get('email'),
                title: formData.get('title'),
                description: formData.get('description'),
                github_link: formData.get('github_link'),
                image: formData.get('image_url') || 'https://via.placeholder.com/300x200?text=Project+Image',
                tags: formData.get('tags') ? formData.get('tags').split(',').map(tag => tag.trim()) : [],
                status: 'pending' // New submissions start as pending until approved
            };

            // Insert the project data into the 'project_submissions' table
            const { data, error } = await supabase
                .from('project_submissions')
                .insert([projectData]);

            if (error) {
                console.error('Error submitting project:', error);
                return { success: false, message: 'Failed to submit project. Please try again.' };
            }

            console.log('Project submitted successfully:', data);
            return { success: true, message: 'Project submitted successfully! It will be reviewed before publishing.' };
        } catch (err) {
            console.error('Error in form submission handler:', err);
            return { success: false, message: 'An unexpected error occurred. Please try again later.' };
        }
    }

    // This function would be called when receiving form data from Google Forms
    // In a real implementation, you would need to set up a webhook or API endpoint
    // to receive the form submissions from Google Forms
    
    // Example of how to process form data when it's received
    window.processGoogleFormSubmission = async function(formData) {
        const result = await handleFormSubmission(formData);
        
        // Show notification to admin or user based on result
        if (result.success) {
            alert(result.message);
        } else {
            alert(result.message);
        }
    };
    
    // Note: To fully implement this, you would need:
    // 1. A server-side component to receive webhook notifications from Google Forms
    // 2. Or use Google Apps Script to send form submissions to your Supabase database
    // 3. Or create a custom form on your website instead of using Google Forms
    
    console.log('Form handler initialized and ready to process submissions');
});
