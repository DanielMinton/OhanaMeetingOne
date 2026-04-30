import jsPDF from 'jspdf';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildMinutesPDFDocument(state: any, password: string) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'letter',
    encryption: password
      ? {
          userPassword: password,
          ownerPassword: password,
          userPermissions: ['print', 'copy'],
        }
      : undefined,
  });

  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentW = pageW - margin * 2;
  let y = margin;

  // Dark theme colors (RGB)
  const bg = [7, 9, 11] as const;
  const panel = [16, 22, 26] as const;
  const teal = [49, 214, 196] as const;
  const orange = [255, 159, 67] as const;
  const textPrimary = [243, 247, 248] as const;
  const textSecondary = [196, 208, 213] as const;
  const textMuted = [122, 143, 152] as const;
  const line = [39, 52, 59] as const;

  const newPage = () => {
    doc.addPage();
    y = margin;
    // Background
    doc.setFillColor(...bg);
    doc.rect(0, 0, pageW, pageH, 'F');
  };

  // Helper to blend two RGB colors (used to simulate low-opacity fills
  // without relying on a jsPDF API that may not expose global alpha).
  const blend = (c1: readonly number[], c2: readonly number[], alpha: number) => {
    const r = Math.round(c1[0] * (1 - alpha) + c2[0] * alpha);
    const g = Math.round(c1[1] * (1 - alpha) + c2[1] * alpha);
    const b = Math.round(c1[2] * (1 - alpha) + c2[2] * alpha);
    return [r, g, b] as const;
  };

  // Background fill for all pages
  const fillBackground = () => {
    doc.setFillColor(...bg);
    doc.rect(0, 0, pageW, pageH, 'F');
  };
  fillBackground();

  const checkPage = (needed = 15) => {
    if (y + needed > pageH - margin) {
      newPage();
      fillBackground();
    }
  };

  // Helper: section header
  const sectionHeader = (title: string) => {
    checkPage(20);
    doc.setFillColor(...panel);
    doc.roundedRect(margin, y, contentW, 10, 2, 2, 'F');
    doc.setTextColor(...teal);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(title.toUpperCase(), margin + 6, y + 7);
    y += 14;
  };

  const bodyText = (text: string, color = textSecondary, fontSize = 9) => {
    doc.setTextColor(...color);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, contentW);
    checkPage(lines.length * 5 + 2);
    doc.text(lines, margin, y);
    y += lines.length * 5 + 2;
  };

  const label = (text: string) => {
    doc.setTextColor(...textMuted);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text(text.toUpperCase(), margin, y);
    y += 4;
  };

  // ===== COVER PAGE =====
  // Gradient suggestion via colored rects (simulate low alpha by blending
  // with the page background so we avoid unsupported jsPDF alpha APIs).
  const softTeal = blend(bg, teal, 0.06);
  doc.setFillColor(...softTeal);
  doc.rect(0, 0, pageW * 0.5, pageH * 0.4, 'F');

  // Ohana header
  y = 50;
  doc.setTextColor(...teal);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.text('OHANA RECOVERY', pageW / 2, y, { align: 'center' });

  y += 12;
  doc.setTextColor(...textMuted);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Official Meeting Minutes', pageW / 2, y, { align: 'center' });

  y += 20;
  doc.setFillColor(...panel);
  doc.roundedRect(margin, y, contentW, 60, 4, 4, 'F');
  doc.setDrawColor(...teal);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, y, contentW, 60, 4, 4, 'S');

  y += 12;
  const typeMap: Record<string, string> = {
    'core-checkin': 'Core Check-In Meeting',
    'organizational-planning': 'Core Organizational Planning Meeting',
    'formal-board': 'Formal Board Meeting',
  };

  doc.setTextColor(...textPrimary);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(typeMap[state.meetingType] || 'Meeting', pageW / 2, y, { align: 'center' });

  y += 10;
  doc.setTextColor(...textSecondary);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.text(state.meetingDate, pageW / 2, y, { align: 'center' });

  y += 7;
  const timeRange = `${state.meetingStartTime || '—'} – ${state.meetingEndTime || '—'}`;
  doc.text(timeRange, pageW / 2, y, { align: 'center' });

  y += 7;
  doc.text(`Platform: ${state.platform}`, pageW / 2, y, { align: 'center' });

  y += 7;
  doc.text(`Secretary: ${state.secretaryName}`, pageW / 2, y, { align: 'center' });

  y += 18;
  doc.setTextColor(...orange);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('CONFIDENTIAL — PASSWORD PROTECTED', pageW / 2, y, { align: 'center' });

  // ===== PAGE 2: ATTENDANCE =====
  newPage();
  fillBackground();
  sectionHeader('Attendance Record');

  const presentAttendees = state.attendees.filter((a: { present: boolean }) => a.present);
  const absentAttendees = state.attendees.filter((a: { present: boolean }) => !a.present);

  if (presentAttendees.length) {
    label('Present');
    presentAttendees.forEach((a: { name: string; email?: string; role: string }) => {
      checkPage(8);
      doc.setTextColor(...teal);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text(`✓  ${a.name}`, margin + 4, y);
      if (a.email || a.role) {
        doc.setTextColor(...textMuted);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.text([a.email, a.role].filter(Boolean).join('  |  '), margin + 50, y);
      }
      y += 6;
    });
  }

  y += 4;
  if (absentAttendees.length) {
    label('Absent');
    absentAttendees.forEach((a: { name: string; email?: string; role: string }) => {
      checkPage(8);
      doc.setTextColor(...textMuted);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(`○  ${a.name}`, margin + 4, y);
      if (a.email) {
        doc.setFontSize(8);
        doc.text(a.email, margin + 50, y);
      }
      y += 6;
    });
  }

  // ===== AGENDA =====
  checkPage(30);
  y += 8;
  sectionHeader('Agenda as Adopted');
  state.agendaItems
    .filter((item: { included: boolean }) => item.included)
    .forEach((item: { text: string }, i: number) => {
      checkPage(8);
      doc.setTextColor(...textSecondary);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(`${i + 1}.  ${item.text}`, margin + 4, y);
      y += 6;
    });
  if (state.agendaNotes) {
    y += 4;
    label('Notes');
    bodyText(state.agendaNotes);
  }

  // ===== SECTION NOTES =====
  const sectionTitles: Record<string, string> = {
    s04: 'Status Reports',
    s05: 'Roles and Titles',
    s06: 'Meeting Schedule',
    s07: 'Mission Statement',
    s08: 'Budget and Donations',
    s09: 'Website and Digital',
    s10: 'Media and Outreach',
    s11: 'Documents and SOPs',
    s12: 'Public Representation and Access',
    s13: 'Action Items',
  };

  Object.entries(sectionTitles).forEach(([id, title]) => {
    const notes = state.sectionNotes[id];
    if (notes && notes.trim()) {
      checkPage(25);
      y += 6;
      sectionHeader(title);
      bodyText(notes);
    }
  });

  // Mission draft
  if (state.missionDraft) {
    checkPage(30);
    y += 6;
    sectionHeader('Mission Statement Draft');
    doc.setTextColor(...textPrimary);
    doc.setFont('helvetica', 'bolditalic');
    doc.setFontSize(11);
    const mLines = doc.splitTextToSize(`"${state.missionDraft}"`, contentW - 8);
    checkPage(mLines.length * 6 + 4);
    doc.text(mLines, margin + 4, y);
    y += mLines.length * 6 + 6;
  }

  // ===== MOTIONS =====
  if (state.motions.length > 0) {
    checkPage(30);
    y += 6;
    sectionHeader('Motions Record');

    state.motions.forEach((m: { text: string; movedBy: string; secondedBy: string; result: string; timestamp: string }, i: number) => {
      checkPage(28);
      doc.setFillColor(...panel);
      doc.roundedRect(margin, y, contentW, 22, 2, 2, 'F');

      doc.setTextColor(...teal);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text(`MOTION ${i + 1}  —  ${m.timestamp}`, margin + 4, y + 6);

      doc.setTextColor(...textSecondary);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      const mText = doc.splitTextToSize(m.text, contentW - 8);
      doc.text(mText.slice(0, 1), margin + 4, y + 12);

      doc.setTextColor(...textMuted);
      doc.setFontSize(8);
      const info = `Moved: ${m.movedBy || '—'}  |  Seconded: ${m.secondedBy || '—'}  |  Result: ${m.result.toUpperCase()}`;
      doc.text(info, margin + 4, y + 19);
      y += 26;
    });
  }

  // ===== ACTION ITEMS =====
  if (state.actionItems.length > 0) {
    checkPage(30);
    y += 6;
    sectionHeader('Action Items');

    state.actionItems.forEach((item: { text: string; owner: string; dueDate: string; status: string; priority: string }) => {
      checkPage(16);
      doc.setFillColor(...panel);
      doc.roundedRect(margin, y, contentW, 12, 2, 2, 'F');

      const pColor = item.priority === 'high' ? [255, 107, 107] as const : item.priority === 'medium' ? orange : textMuted;
      doc.setFillColor(pColor[0], pColor[1], pColor[2]);
      doc.roundedRect(margin, y, 3, 12, 0, 0, 'F');

      doc.setTextColor(...textSecondary);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      const tText = doc.splitTextToSize(item.text, contentW - 80);
      doc.text(tText.slice(0, 1), margin + 6, y + 7);

      doc.setTextColor(...textMuted);
      doc.setFontSize(7.5);
      doc.text(`${item.owner || '—'}`, margin + contentW - 90, y + 5);
      doc.text(`Due: ${item.dueDate || '—'}`, margin + contentW - 90, y + 10);
      doc.text(item.status.toUpperCase(), margin + contentW - 30, y + 7);
      y += 15;
    });
  }

  // ===== CLOSING =====
  checkPage(60);
  y += 10;
  sectionHeader('Closing');

  if (state.nextMeetingDateTime) {
    label('Next Meeting');
    bodyText(new Date(state.nextMeetingDateTime).toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }));
    y += 4;
  }

  // Signatures
  if (state.chairSignature || state.secretarySignature) {
    checkPage(60);
    label('Signatures');
    y += 4;

    if (state.chairSignature) {
      try {
        doc.addImage(state.chairSignature, 'PNG', margin, y, 70, 28);
        doc.setDrawColor(...line);
        doc.setLineWidth(0.3);
        doc.line(margin, y + 28, margin + 70, y + 28);
        doc.setTextColor(...textMuted);
        doc.setFontSize(7.5);
        doc.text('Chair Signature', margin, y + 33);
      } catch { /* skip if invalid */ }
    }

    if (state.secretarySignature) {
      try {
        doc.addImage(state.secretarySignature, 'PNG', margin + 90, y, 70, 28);
        doc.setDrawColor(...line);
        doc.line(margin + 90, y + 28, margin + 160, y + 28);
        doc.setTextColor(...textMuted);
        doc.setFontSize(7.5);
        doc.text(`Secretary: ${state.secretaryName}`, margin + 90, y + 33);
      } catch { /* skip */ }
    }
    y += 40;
  }

  checkPage(12);
  doc.setTextColor(...textMuted);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.text('These minutes were recorded using the Ohana Recovery Meeting System.', pageW / 2, y, { align: 'center' });

  // Page numbers
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setTextColor(...textMuted);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text(`Page ${i} of ${totalPages}  —  Ohana Recovery Meeting Minutes  —  CONFIDENTIAL`, pageW / 2, pageH - 8, { align: 'center' });
  }

  // Save
  return doc;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getMinutesFileName(state: any) {
  return `ohana-minutes-${state.meetingDate.replace(/,?\s+/g, '-').toLowerCase()}.pdf`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function generateMinutesPDFBlob(state: any, password: string) {
  const doc = buildMinutesPDFDocument(state, password);
  return doc.output('blob');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function generateMinutesPDF(state: any, password: string) {
  const doc = buildMinutesPDFDocument(state, password);
  const fileName = getMinutesFileName(state);
  doc.save(fileName);
}
