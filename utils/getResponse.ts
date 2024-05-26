export default async function getResponse(
  data: any,
  message: string,
  status: number = 200
) {
  const res = Response as any;
  return res.json({ data, message });
}
