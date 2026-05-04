import districts from "@/lib/data/district.json";
import thanas from "@/lib/data/thana.json";

export type District = {
  _id: number;
  division_id: number;
  name: string;
  name_bn: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Thana = {
  _id: number;
  district_id: number;
  name: string;
  name_bn: string | null;
  createdAt: string;
  updatedAt: string;
};

export function getAllDistricts(): District[] {
  return districts as District[];
}

export function getThanasByDistrict(districtId: number): Thana[] {
  return (thanas as Thana[]).filter((thana) => thana.district_id === districtId);
}
