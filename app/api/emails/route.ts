import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { getSession } from '@/lib/auth';
import sanitizeHtml from 'sanitize-html';
import type { Email } from '@/types/email';

const MAX_CONTENT_LENGTH = 10000;

export async function GET() {
  try {
    const db = await getDb();
    const emails = await db
      .collection('emails')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const formattedEmails = emails.map((email) => ({
      _id: email._id.toString(),
      subject: email.subject,
      content: email.content,
      signature: email.signature,
      authorId: email.authorId,
      createdAt: email.createdAt,
      updatedAt: email.updatedAt,
    }));

    return NextResponse.json(formattedEmails, { status: 200 });
  } catch (error) {
    console.error('Error fetching emails:', error);
    return NextResponse.json(
      { error: 'Failed to fetch emails' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { subject, content, signature } = body;

    // Validation
    if (!subject || !content || !signature) {
      return NextResponse.json(
        { error: 'Subject, content, and signature are required' },
        { status: 400 }
      );
    }

    if (signature.trim().length < 2) {
      return NextResponse.json(
        { error: 'Signature must be at least 2 characters' },
        { status: 400 }
      );
    }

    if (content.length > MAX_CONTENT_LENGTH) {
      return NextResponse.json(
        { error: `Content must not exceed ${MAX_CONTENT_LENGTH} characters` },
        { status: 400 }
      );
    }

    // Sanitize HTML content
    const sanitizedContent = sanitizeHtml(content, {
      allowedTags: [
        'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li', 'a', 'span', 'div',
      ],
      allowedAttributes: {
        a: ['href', 'target', 'rel'],
        span: ['style'],
        p: ['style'],
        div: ['style'],
      },
      allowedStyles: {
        '*': {
          'color': [/^#[0-9a-fA-F]{3,6}$/, /^rgb\(/],
          'text-align': [/^left$/, /^right$/, /^center$/, /^justify$/],
        }
      }
    });

    const db = await getDb();
    const now = new Date();
    
    const email: Omit<Email, '_id'> = {
      subject: subject.trim(),
      content: sanitizedContent,
      signature: signature.trim(),
      authorId: session.userId,
      createdAt: now,
      updatedAt: now,
    };

    const result = await db.collection('emails').insertOne(email);

    return NextResponse.json(
      {
        success: true,
        emailId: result.insertedId.toString(),
        email: {
          ...email,
          _id: result.insertedId.toString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating email:', error);
    return NextResponse.json(
      { error: 'Failed to create email' },
      { status: 500 }
    );
  }
}
