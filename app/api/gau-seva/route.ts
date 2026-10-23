import { prisma } from "@/lib/db";
import { gauSevaSchema } from "@/lib/validators";
import { zodErrorMessage, jsonError } from "@/lib/api";
import { PRICES } from "@/lib/constants";

export const dynamic = "force-dynamic";

// GET /api/gau-seva — recent contributions (M3)
export async function GET() {
  const contributions = await prisma.gauContribution.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
  });
  return Response.json({ contributions });
}

// POST /api/gau-seva — TREE ₹501 / CHARA_DAILY ₹510 / CHARA_MONTHLY ₹2100
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError("अमान्य अनुरोध।");
  }

  const parsed = gauSevaSchema.safeParse(body);
  if (!parsed.success) return jsonError(zodErrorMessage(parsed.error));

  const { donorName, kind, treeType } = parsed.data;
  const amount =
    kind === "TREE" ? PRICES.TREE_PLANTATION : kind === "CHARA_DAILY" ? PRICES.CHARA_DAILY : PRICES.CHARA_MONTHLY;

  // certificateNo only for स्मृति वृक्षारोपण (e-certificate promise, TC-GS-01)
  let certificateNo: string | null = null;
  if (kind === "TREE") {
    const count = await prisma.gauContribution.count({ where: { kind: "TREE" } });
    certificateNo = `SN-VRK-${String(count + 1).padStart(4, "0")}`;
  }

  const contribution = await prisma.gauContribution.create({
    data: {
      // TC-GS-02: empty donor falls back to "श्रद्धालु"
      donorName: donorName && donorName.length > 0 ? donorName : "श्रद्धालु",
      kind,
      treeType: kind === "TREE" ? (treeType && treeType.length > 0 ? treeType : null) : null,
      amount,
      certificateNo,
    },
  });

  return Response.json(contribution, { status: 201 });
}
