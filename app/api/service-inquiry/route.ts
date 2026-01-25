import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      name,
      email,
      company,
      phone,
      message,
      budget,
      timeline,
      serviceId,
      serviceName,
      serviceCategory,
      timestamp
    } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Here you would typically:
    // 1. Save to database
    // 2. Send email notification
    // 3. Integrate with CRM
    // 4. Send confirmation email to user
    
    // For now, we'll log the inquiry
    console.log('Service Inquiry Received:', {
      name,
      email,
      company,
      phone,
      serviceName,
      serviceCategory,
      budget,
      timeline,
      message,
      timestamp
    });

    // Simulate database save or email sending
    // In production, you would integrate with:
    // - Email service (SendGrid, Resend, etc.)
    // - Database (MongoDB, PostgreSQL, etc.)
    // - CRM (HubSpot, Salesforce, etc.)

    // Example: Send email notification (you'll need to implement this)
    /*
    await sendEmail({
      to: 'your-email@example.com',
      subject: `New Service Inquiry: ${serviceName}`,
      body: `
        New inquiry received:
        
        Service: ${serviceName} (${serviceCategory})
        Name: ${name}
        Email: ${email}
        Company: ${company || 'N/A'}
        Phone: ${phone || 'N/A'}
        Budget: ${budget || 'N/A'}
        Timeline: ${timeline || 'N/A'}
        
        Message:
        ${message}
      `
    });
    */

    return NextResponse.json(
      {
        success: true,
        message: 'Inquiry submitted successfully',
        inquiryId: `INQ-${Date.now()}` // Generate a unique inquiry ID
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error processing service inquiry:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint to retrieve inquiries (for admin dashboard)
export async function GET(request: NextRequest) {
  // This would be protected with authentication in production
  // Return list of all service inquiries
  return NextResponse.json(
    {
      message: 'GET endpoint for admin dashboard - implement authentication'
    },
    { status: 200 }
  );
}
