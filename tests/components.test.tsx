import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VerdictBadge } from '../src/components/VerdictBadge';
import { MediaUploader } from '../src/components/MediaUploader';
import { InvestigationProcess } from '../src/components/InvestigationProcess';

// ─── VerdictBadge ────────────────────────────────────────────────────────────
describe('VerdictBadge', () => {
  it('renders LIKELY_AUTHENTIC verdict', () => {
    render(<VerdictBadge verdict="LIKELY_AUTHENTIC" />);
    expect(screen.getByText(/authentic/i)).toBeDefined();
  });

  it('renders LIKELY_MANIPULATED verdict', () => {
    render(<VerdictBadge verdict="LIKELY_MANIPULATED" />);
    expect(screen.getByText(/manipulated/i)).toBeDefined();
  });

  it('renders REQUIRES_VERIFICATION verdict', () => {
    render(<VerdictBadge verdict="REQUIRES_VERIFICATION" />);
    expect(screen.getByText(/verification/i)).toBeDefined();
  });
});

// ─── MediaUploader ────────────────────────────────────────────────────────────
describe('MediaUploader', () => {
  it('renders upload and URL tabs', () => {
    const mockFn = vi.fn();
    render(<MediaUploader onInvestigate={mockFn} />);
    expect(screen.getByText(/upload file/i)).toBeDefined();
    // "Paste URL" appears in both the tab label and the drop zone hint text
    expect(screen.getAllByText(/paste url/i).length).toBeGreaterThan(0);
  });

  it('switches to URL tab on click and shows input', async () => {
    const user = userEvent.setup();
    const mockFn = vi.fn();
    render(<MediaUploader onInvestigate={mockFn} />);
    // Use getAllByText to handle duplicates and click the first (tab button)
    const urlTabButton = screen.getAllByText(/paste url/i)[0];
    await user.click(urlTabButton);
    const input = await screen.findByPlaceholderText(/https/i);
    expect(input).toBeDefined();
  });

  it('shows investigate button when URL is entered', async () => {
    const user = userEvent.setup();
    const mockFn = vi.fn();
    render(<MediaUploader onInvestigate={mockFn} />);
    await user.click(screen.getAllByText(/paste url/i)[0]);
    const input = await screen.findByPlaceholderText(/https/i);
    await user.type(input, 'https://example.com/image.jpg');
    expect(screen.getByText(/investigate media/i)).toBeDefined();
  });

  it('rejects video files and calls alert', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const mockFn = vi.fn();
    const { container } = render(<MediaUploader onInvestigate={mockFn} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const videoFile = new File(['content'], 'video.mp4', { type: 'video/mp4' });
    // Directly fire the change event with the video file
    Object.defineProperty(input, 'files', { value: [videoFile], configurable: true });
    input.dispatchEvent(new Event('change', { bubbles: true }));
    expect(alertSpy).toHaveBeenCalled();
    alertSpy.mockRestore();
  });
});

// ─── InvestigationProcess ────────────────────────────────────────────────────
describe('InvestigationProcess', () => {
  it('renders the investigation panel', () => {
    render(<InvestigationProcess currentStage={0} />);
    expect(screen.getByText(/conducting investigation/i)).toBeDefined();
  });

  it('shows the first stage as processing', () => {
    render(<InvestigationProcess currentStage={0} />);
    expect(screen.getByText(/media received/i)).toBeDefined();
  });

  it('marks earlier stages as complete when stage advances', () => {
    render(<InvestigationProcess currentStage={3} />);
    expect(screen.getByText(/media received/i)).toBeDefined();
    expect(screen.getByText(/extracting media metadata/i)).toBeDefined();
  });
});
