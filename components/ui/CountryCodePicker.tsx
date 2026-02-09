"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface CountryDialCode {
  code: string;
  name: string;
  dial: string;
}

export const COUNTRY_DIAL_CODES: CountryDialCode[] = [
  { code: "US", name: "United States", dial: "+1" },
  { code: "CA", name: "Canada", dial: "+1" },
  { code: "GB", name: "United Kingdom", dial: "+44" },
  { code: "AU", name: "Australia", dial: "+61" },
  { code: "DE", name: "Germany", dial: "+49" },
  { code: "FR", name: "France", dial: "+33" },
  { code: "IT", name: "Italy", dial: "+39" },
  { code: "ES", name: "Spain", dial: "+34" },
  { code: "NL", name: "Netherlands", dial: "+31" },
  { code: "BE", name: "Belgium", dial: "+32" },
  { code: "CH", name: "Switzerland", dial: "+41" },
  { code: "AT", name: "Austria", dial: "+43" },
  { code: "IE", name: "Ireland", dial: "+353" },
  { code: "NZ", name: "New Zealand", dial: "+64" },
  { code: "SG", name: "Singapore", dial: "+65" },
  { code: "HK", name: "Hong Kong", dial: "+852" },
  { code: "JP", name: "Japan", dial: "+81" },
  { code: "KR", name: "South Korea", dial: "+82" },
  { code: "CN", name: "China", dial: "+86" },
  { code: "IN", name: "India", dial: "+91" },
  { code: "BR", name: "Brazil", dial: "+55" },
  { code: "MX", name: "Mexico", dial: "+52" },
  { code: "AR", name: "Argentina", dial: "+54" },
  { code: "ZA", name: "South Africa", dial: "+27" },
  { code: "AE", name: "UAE", dial: "+971" },
  { code: "SA", name: "Saudi Arabia", dial: "+966" },
  { code: "PH", name: "Philippines", dial: "+63" },
  { code: "MY", name: "Malaysia", dial: "+60" },
  { code: "TH", name: "Thailand", dial: "+66" },
  { code: "VN", name: "Vietnam", dial: "+84" },
  { code: "ID", name: "Indonesia", dial: "+62" },
  { code: "PK", name: "Pakistan", dial: "+92" },
  { code: "EG", name: "Egypt", dial: "+20" },
  { code: "NG", name: "Nigeria", dial: "+234" },
  { code: "KE", name: "Kenya", dial: "+254" },
];

interface CountryCodePickerProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function CountryCodePicker({
  value,
  onChange,
  className = "w-[180px]",
}: CountryCodePickerProps) {
  const selectedCountry = COUNTRY_DIAL_CODES.find((c) => c.code === value) || COUNTRY_DIAL_CODES[0];

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className}>
        <SelectValue>
          {selectedCountry.code} ({selectedCountry.dial})
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {COUNTRY_DIAL_CODES.map((country) => (
          <SelectItem key={country.code} value={country.code}>
            {country.name} ({country.dial})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function getDialCode(countryCode: string): string {
  const country = COUNTRY_DIAL_CODES.find((c) => c.code === countryCode);
  return country?.dial || "+1";
}
