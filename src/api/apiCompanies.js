import SupabaseClient,{supabaseUrl} from "@/utils/Superbase";

export async function getCompanies(token) {
  const supabase = await SupabaseClient(token);
  const { data, error } = await supabase.from("companies").select("*");
  if (error) {
    console.error("Error fetching Companies:", error);
    return null;
  }
  return data;
}
export async function addNewCompany(token, _, companyData) {
  const supabase = await SupabaseClient(token);
  const random = Math.floor(Math.random() * 90000);
  const fileName = `logo-${random}-${companyData.name}`;
  const { error: storageError } = await supabase.storage
    .from("compeny_logoo")
    .upload(fileName, companyData.logo);

  if (storageError) throw new Error("Error uploading Company Logo");

  const logo_url = `${supabaseUrl}/storage/v1/object/public/compeny_logoo/${fileName}`;

  const { data, error } = await supabase
    .from("companies")
    .insert([
      {
        name: companyData.name,
        logo_url: logo_url,
      },
    ])
    .select();

  if (error) {
    console.error(error);
    throw new Error("Error submitting Companies");
  }

  return data;
}