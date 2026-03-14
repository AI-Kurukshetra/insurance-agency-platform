import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver } from "react-hook-form";
import type { ZodTypeAny } from "zod";

export function createFormResolver(schema: ZodTypeAny): Resolver<any> {
  return zodResolver(schema) as Resolver<any>;
}
