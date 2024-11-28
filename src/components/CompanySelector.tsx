"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Company } from "../types";

interface CompanySelectorProps {
  companies: Company[];
  selectedCompany: Company;
  onSelectCompany: (company: Company) => void;
}

export function CompanySelector({
  companies,
  selectedCompany,
  onSelectCompany,
}: CompanySelectorProps) {
  return (
    <div className="w-[200px]">
      <Select
        value={selectedCompany.id.toString()}
        onValueChange={(value) =>
          onSelectCompany(companies.find((c) => c.id.toString() === value)!)
        }
      >
        <SelectTrigger className="w-full bg-card border-input hover:bg-accent/50 transition-colors">
          <SelectValue placeholder="Select a company" />
        </SelectTrigger>
        <SelectContent className="bg-card">
          {companies.map((company) => (
            <SelectItem
              key={company.id}
              value={company.id.toString()}
              className="hover:bg-accent/50 cursor-pointer transition-colors"
            >
              {company.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
