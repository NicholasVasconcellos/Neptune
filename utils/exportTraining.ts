import { Platform } from "react-native";
import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as Print from "expo-print";
import { formatTimeShort } from "@/utils/timeFormatting";

// ─── Helpers ────────────────────────────────────────────────────────────

function escapeCSV(value: string | number | null | undefined): string {
  if (value == null) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function formatInterval(seconds: number | null | undefined): string {
  if (seconds == null || seconds === 0) return "";
  return formatTimeShort(seconds);
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9_-]/g, "_").substring(0, 50);
}

// ─── CSV Export ─────────────────────────────────────────────────────────

function buildCSVContent(
  training: Record<string, any>,
  exercises: Record<string, any>[],
): string {
  const lines: string[] = [];

  // Metadata
  lines.push(`Training Name,${escapeCSV(training.Name)}`);
  lines.push(`Date,${escapeCSV(training.Date ?? "")}`);
  if (training.Notes) {
    lines.push(`Notes,${escapeCSV(training.Notes)}`);
  }
  lines.push(""); // blank separator

  // Column headers
  lines.push("#,Name,Reps,Distance (m),Interval,Energy System,Note");

  // Exercise rows
  exercises.forEach((ex, i) => {
    lines.push(
      [
        i + 1,
        escapeCSV(ex.Name),
        ex.Repetitions ?? "",
        ex.Distance ?? "",
        formatInterval(ex.Interval),
        ex["Energy System"] ?? "",
        escapeCSV(ex.Note),
      ].join(","),
    );
  });

  return lines.join("\n");
}

export async function exportTrainingCSV(
  training: Record<string, any>,
  exercises: Record<string, any>[],
): Promise<void> {
  const csv = buildCSVContent(training, exercises);
  const filename = `${sanitizeFilename(training.Name ?? "Training")}_${training.Date ?? "export"}.csv`;

  if (Platform.OS === "web") {
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    return;
  }

  const file = new File(Paths.cache, filename);
  file.write(csv);
  await Sharing.shareAsync(file.uri, {
    mimeType: "text/csv",
    UTI: "public.comma-separated-values-text",
  });
}

// ─── PDF Export ─────────────────────────────────────────────────────────

function buildPDFHTML(
  training: Record<string, any>,
  exercises: Record<string, any>[],
): string {
  let totalDistance = 0;
  let totalTime = 0;

  const exerciseRows = exercises
    .map((ex, i) => {
      const reps = ex.Repetitions ?? 0;
      const dist = ex.Distance ?? 0;
      totalDistance += reps * dist;
      totalTime += reps * (ex.Interval ?? 0);

      const bgColor = i % 2 === 0 ? "#ffffff" : "#f4f6f8";
      return `
      <tr style="background-color: ${bgColor};">
        <td style="padding: 8px 10px; text-align: center;">${i + 1}</td>
        <td style="padding: 8px 10px;">${ex.Name ?? ""}</td>
        <td style="padding: 8px 10px; text-align: center;">${reps || ""}</td>
        <td style="padding: 8px 10px; text-align: center;">${dist || ""}</td>
        <td style="padding: 8px 10px; text-align: center;">${formatInterval(ex.Interval)}</td>
        <td style="padding: 8px 10px; text-align: center;">${ex["Energy System"] ?? ""}</td>
        <td style="padding: 8px 10px;">${ex.Note ?? ""}</td>
      </tr>`;
    })
    .join("");

  const totalsRow = `
    <tr style="background-color: #e8f4fd; font-weight: 600;">
      <td style="padding: 8px 10px;" colspan="3">Totals</td>
      <td style="padding: 8px 10px; text-align: center;">${totalDistance}</td>
      <td style="padding: 8px 10px; text-align: center;">${totalTime > 0 ? formatTimeShort(totalTime) : ""}</td>
      <td style="padding: 8px 10px;" colspan="2"></td>
    </tr>`;

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8" />
    <style>
      body {
        font-family: -apple-system, system-ui, "Segoe UI", Roboto, sans-serif;
        margin: 40px;
        color: #1a1a1a;
      }
      h1 {
        font-size: 24px;
        margin: 0 0 4px 0;
        color: #1a1a1a;
      }
      .accent-bar {
        width: 60px;
        height: 4px;
        background-color: #4fc3f7;
        border-radius: 2px;
        margin-bottom: 16px;
      }
      .meta {
        font-size: 13px;
        color: #666;
        margin-bottom: 4px;
      }
      .notes {
        font-size: 13px;
        color: #444;
        font-style: italic;
        margin: 8px 0 20px 0;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        font-size: 13px;
        margin-top: 12px;
      }
      thead tr {
        background-color: #4fc3f7;
        color: #ffffff;
      }
      thead th {
        padding: 10px;
        text-align: left;
        font-weight: 600;
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      thead th:nth-child(1),
      thead th:nth-child(3),
      thead th:nth-child(4),
      thead th:nth-child(5),
      thead th:nth-child(6) {
        text-align: center;
      }
      tbody tr {
        border-bottom: 1px solid #eee;
      }
      .footer {
        margin-top: 30px;
        font-size: 11px;
        color: #999;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <h1>${training.Name ?? "Training"}</h1>
    <div class="accent-bar"></div>
    <div class="meta">${training.Date ?? ""}</div>
    ${training.Notes ? `<div class="notes">${training.Notes}</div>` : ""}

    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Exercise</th>
          <th>Reps</th>
          <th>Dist (m)</th>
          <th>Interval</th>
          <th>Energy</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        ${exerciseRows}
        ${totalsRow}
      </tbody>
    </table>

    <div class="footer">Generated by Neptune Swim &middot; ${new Date().toLocaleDateString()}</div>
  </body>
  </html>`;
}

export async function exportTrainingPDF(
  training: Record<string, any>,
  exercises: Record<string, any>[],
): Promise<void> {
  const html = buildPDFHTML(training, exercises);

  if (Platform.OS === "web") {
    await Print.printAsync({ html });
    return;
  }

  const { uri } = await Print.printToFileAsync({ html });

  // Rename to a meaningful filename
  const filename = `${sanitizeFilename(training.Name ?? "Training")}_${training.Date ?? "export"}.pdf`;
  const dest = new File(Paths.cache, filename);
  const source = new File(uri);
  source.move(dest);

  await Sharing.shareAsync(dest.uri, {
    mimeType: "application/pdf",
    UTI: "com.adobe.pdf",
  });
}
