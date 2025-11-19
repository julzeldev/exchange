import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { getSession } from '@/lib/auth';
import { ObjectId } from 'mongodb';
import sanitizeHtml from 'sanitize-html';

const MAX_CONTENT_LENGTH = 10000;
const EDIT_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
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

    const db = await getDb();
    const email = await db.collection('emails').findOne({
      _id: new ObjectId(id),
    });

    if (!email) {
      return NextResponse.json(
        { error: 'Email not found' },
        { status: 404 }
      );
    }

    // Check if user is the author
    if (email.authorId !== session.userId) {
      return NextResponse.json(
        { error: 'You can only edit your own emails' },
        { status: 403 }
      );
    }

    // Check if within edit window
    const emailCreatedAt = new Date(email.createdAt).getTime();
    const now = Date.now();
    const elapsed = now - emailCreatedAt;

    if (elapsed > EDIT_WINDOW_MS) {
      return NextResponse.json(
        { error: 'Edit window has expired (5 minutes)' },
        { status: 403 }
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

    const updateResult = await db.collection('emails').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          subject: subject.trim(),
          content: sanitizedContent,
          signature: signature.trim(),
          updatedAt: new Date(),
        },
      }
    );

    if (updateResult.modifiedCount === 0) {
      return NextResponse.json(
        { error: 'Failed to update email' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Email updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating email:', error);
    return NextResponse.json(
      { error: 'Failed to update email' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const db = await getDb();
    
    const email = await db.collection('emails').findOne({
      _id: new ObjectId(id),
    });

    if (!email) {
      return NextResponse.json(
        { error: 'Email not found' },
        { status: 404 }
      );
    }

    // Check if user is the author
    if (email.authorId !== session.userId) {
      return NextResponse.json(
        { error: 'You can only delete your own emails' },
        { status: 403 }
      );
    }

    // Check if within edit window
    const emailCreatedAt = new Date(email.createdAt).getTime();
    const now = Date.now();
    const elapsed = now - emailCreatedAt;

    if (elapsed > EDIT_WINDOW_MS) {
      return NextResponse.json(
        { error: 'Delete window has expired (5 minutes)' },
        { status: 403 }
      );
    }

    const deleteResult = await db.collection('emails').deleteOne({
      _id: new ObjectId(id),
    });

    if (deleteResult.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Failed to delete email' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Email deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting email:', error);
    return NextResponse.json(
      { error: 'Failed to delete email' },
      { status: 500 }
    );
  }
}
