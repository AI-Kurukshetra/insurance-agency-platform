export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.4";
  };
  public: {
    Tables: {
      activities: {
        Row: {
          claim_id: string | null;
          client_id: string | null;
          created_at: string;
          description: string;
          id: string;
          lead_id: string | null;
          performed_by: string | null;
          policy_id: string | null;
          type: string;
        };
        Insert: {
          claim_id?: string | null;
          client_id?: string | null;
          created_at?: string;
          description: string;
          id?: string;
          lead_id?: string | null;
          performed_by?: string | null;
          policy_id?: string | null;
          type: string;
        };
        Update: {
          claim_id?: string | null;
          client_id?: string | null;
          created_at?: string;
          description?: string;
          id?: string;
          lead_id?: string | null;
          performed_by?: string | null;
          policy_id?: string | null;
          type?: string;
        };
        Relationships: [
          {
            foreignKeyName: "activities_claim_id_fkey";
            columns: ["claim_id"];
            isOneToOne: false;
            referencedRelation: "claims";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "activities_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "activities_lead_id_fkey";
            columns: ["lead_id"];
            isOneToOne: false;
            referencedRelation: "leads";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "activities_performed_by_fkey";
            columns: ["performed_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "activities_policy_id_fkey";
            columns: ["policy_id"];
            isOneToOne: false;
            referencedRelation: "policies";
            referencedColumns: ["id"];
          },
        ];
      };
      agencies: {
        Row: {
          address: string | null;
          city: string | null;
          created_at: string;
          email: string | null;
          id: string;
          license_no: string | null;
          name: string;
          phone: string | null;
          state: string | null;
          updated_at: string;
          website: string | null;
          zip: string | null;
        };
        Insert: {
          address?: string | null;
          city?: string | null;
          created_at?: string;
          email?: string | null;
          id?: string;
          license_no?: string | null;
          name: string;
          phone?: string | null;
          state?: string | null;
          updated_at?: string;
          website?: string | null;
          zip?: string | null;
        };
        Update: {
          address?: string | null;
          city?: string | null;
          created_at?: string;
          email?: string | null;
          id?: string;
          license_no?: string | null;
          name?: string;
          phone?: string | null;
          state?: string | null;
          updated_at?: string;
          website?: string | null;
          zip?: string | null;
        };
        Relationships: [];
      };
      audit_logs: {
        Row: {
          action: string;
          created_at: string;
          id: string;
          ip_address: string | null;
          new_data: Json | null;
          old_data: Json | null;
          performed_by: string | null;
          record_id: string;
          table_name: string;
        };
        Insert: {
          action: string;
          created_at?: string;
          id?: string;
          ip_address?: string | null;
          new_data?: Json | null;
          old_data?: Json | null;
          performed_by?: string | null;
          record_id: string;
          table_name: string;
        };
        Update: {
          action?: string;
          created_at?: string;
          id?: string;
          ip_address?: string | null;
          new_data?: Json | null;
          old_data?: Json | null;
          performed_by?: string | null;
          record_id?: string;
          table_name?: string;
        };
        Relationships: [
          {
            foreignKeyName: "audit_logs_performed_by_fkey";
            columns: ["performed_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      carriers: {
        Row: {
          code: string;
          contact_email: string | null;
          contact_name: string | null;
          contact_phone: string | null;
          created_at: string;
          id: string;
          lines_of_business: string[] | null;
          name: string;
          status: string;
          updated_at: string;
          website: string | null;
        };
        Insert: {
          code: string;
          contact_email?: string | null;
          contact_name?: string | null;
          contact_phone?: string | null;
          created_at?: string;
          id?: string;
          lines_of_business?: string[] | null;
          name: string;
          status?: string;
          updated_at?: string;
          website?: string | null;
        };
        Update: {
          code?: string;
          contact_email?: string | null;
          contact_name?: string | null;
          contact_phone?: string | null;
          created_at?: string;
          id?: string;
          lines_of_business?: string[] | null;
          name?: string;
          status?: string;
          updated_at?: string;
          website?: string | null;
        };
        Relationships: [];
      };
      certificates: {
        Row: {
          certificate_number: string;
          client_id: string;
          created_at: string;
          created_by: string | null;
          expiry_date: string | null;
          file_url: string | null;
          holder_address: string | null;
          holder_name: string;
          id: string;
          issued_date: string;
          policy_id: string;
          status: string;
          updated_at: string;
        };
        Insert: {
          certificate_number: string;
          client_id: string;
          created_at?: string;
          created_by?: string | null;
          expiry_date?: string | null;
          file_url?: string | null;
          holder_address?: string | null;
          holder_name: string;
          id?: string;
          issued_date?: string;
          policy_id: string;
          status?: string;
          updated_at?: string;
        };
        Update: {
          certificate_number?: string;
          client_id?: string;
          created_at?: string;
          created_by?: string | null;
          expiry_date?: string | null;
          file_url?: string | null;
          holder_address?: string | null;
          holder_name?: string;
          id?: string;
          issued_date?: string;
          policy_id?: string;
          status?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "certificates_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "certificates_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "certificates_policy_id_fkey";
            columns: ["policy_id"];
            isOneToOne: false;
            referencedRelation: "policies";
            referencedColumns: ["id"];
          },
        ];
      };
      claims: {
        Row: {
          adjuster_name: string | null;
          adjuster_phone: string | null;
          assigned_agent_id: string | null;
          carrier_id: string;
          claim_amount: number | null;
          claim_number: string;
          client_id: string;
          created_at: string;
          created_by: string | null;
          description: string;
          id: string;
          incident_date: string;
          notes: string | null;
          policy_id: string;
          reported_date: string;
          settled_amount: number | null;
          status: string;
          updated_at: string;
        };
        Insert: {
          adjuster_name?: string | null;
          adjuster_phone?: string | null;
          assigned_agent_id?: string | null;
          carrier_id: string;
          claim_amount?: number | null;
          claim_number: string;
          client_id: string;
          created_at?: string;
          created_by?: string | null;
          description: string;
          id?: string;
          incident_date: string;
          notes?: string | null;
          policy_id: string;
          reported_date?: string;
          settled_amount?: number | null;
          status?: string;
          updated_at?: string;
        };
        Update: {
          adjuster_name?: string | null;
          adjuster_phone?: string | null;
          assigned_agent_id?: string | null;
          carrier_id?: string;
          claim_amount?: number | null;
          claim_number?: string;
          client_id?: string;
          created_at?: string;
          created_by?: string | null;
          description?: string;
          id?: string;
          incident_date?: string;
          notes?: string | null;
          policy_id?: string;
          reported_date?: string;
          settled_amount?: number | null;
          status?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "claims_assigned_agent_id_fkey";
            columns: ["assigned_agent_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "claims_carrier_id_fkey";
            columns: ["carrier_id"];
            isOneToOne: false;
            referencedRelation: "carriers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "claims_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "claims_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "claims_policy_id_fkey";
            columns: ["policy_id"];
            isOneToOne: false;
            referencedRelation: "policies";
            referencedColumns: ["id"];
          },
        ];
      };
      clients: {
        Row: {
          address: string | null;
          assigned_agent_id: string | null;
          business_name: string | null;
          city: string | null;
          client_id: string;
          created_at: string;
          created_by: string | null;
          date_of_birth: string | null;
          email: string;
          first_name: string | null;
          id: string;
          last_name: string | null;
          notes: string | null;
          phone: string | null;
          state: string | null;
          status: string;
          type: string;
          updated_at: string;
          zip: string | null;
        };
        Insert: {
          address?: string | null;
          assigned_agent_id?: string | null;
          business_name?: string | null;
          city?: string | null;
          client_id: string;
          created_at?: string;
          created_by?: string | null;
          date_of_birth?: string | null;
          email: string;
          first_name?: string | null;
          id?: string;
          last_name?: string | null;
          notes?: string | null;
          phone?: string | null;
          state?: string | null;
          status?: string;
          type?: string;
          updated_at?: string;
          zip?: string | null;
        };
        Update: {
          address?: string | null;
          assigned_agent_id?: string | null;
          business_name?: string | null;
          city?: string | null;
          client_id?: string;
          created_at?: string;
          created_by?: string | null;
          date_of_birth?: string | null;
          email?: string;
          first_name?: string | null;
          id?: string;
          last_name?: string | null;
          notes?: string | null;
          phone?: string | null;
          state?: string | null;
          status?: string;
          type?: string;
          updated_at?: string;
          zip?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "clients_assigned_agent_id_fkey";
            columns: ["assigned_agent_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "clients_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      commissions: {
        Row: {
          agent_id: string | null;
          carrier_id: string;
          commission_amount: number;
          commission_rate: number | null;
          created_at: string;
          created_by: string | null;
          gross_premium: number;
          id: string;
          notes: string | null;
          paid_date: string | null;
          payment_reference: string | null;
          policy_id: string | null;
          status: string;
          type: string;
          updated_at: string;
        };
        Insert: {
          agent_id?: string | null;
          carrier_id: string;
          commission_amount: number;
          commission_rate?: number | null;
          created_at?: string;
          created_by?: string | null;
          gross_premium: number;
          id?: string;
          notes?: string | null;
          paid_date?: string | null;
          payment_reference?: string | null;
          policy_id?: string | null;
          status?: string;
          type?: string;
          updated_at?: string;
        };
        Update: {
          agent_id?: string | null;
          carrier_id?: string;
          commission_amount?: number;
          commission_rate?: number | null;
          created_at?: string;
          created_by?: string | null;
          gross_premium?: number;
          id?: string;
          notes?: string | null;
          paid_date?: string | null;
          payment_reference?: string | null;
          policy_id?: string | null;
          status?: string;
          type?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "commissions_agent_id_fkey";
            columns: ["agent_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "commissions_carrier_id_fkey";
            columns: ["carrier_id"];
            isOneToOne: false;
            referencedRelation: "carriers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "commissions_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "commissions_policy_id_fkey";
            columns: ["policy_id"];
            isOneToOne: false;
            referencedRelation: "policies";
            referencedColumns: ["id"];
          },
        ];
      };
      documents: {
        Row: {
          claim_id: string | null;
          client_id: string | null;
          created_at: string;
          file_size: number | null;
          file_url: string;
          id: string;
          mime_type: string | null;
          name: string;
          policy_id: string | null;
          quote_id: string | null;
          tags: string[] | null;
          type: string;
          updated_at: string;
          uploaded_by: string | null;
          version: number;
        };
        Insert: {
          claim_id?: string | null;
          client_id?: string | null;
          created_at?: string;
          file_size?: number | null;
          file_url: string;
          id?: string;
          mime_type?: string | null;
          name: string;
          policy_id?: string | null;
          quote_id?: string | null;
          tags?: string[] | null;
          type: string;
          updated_at?: string;
          uploaded_by?: string | null;
          version?: number;
        };
        Update: {
          claim_id?: string | null;
          client_id?: string | null;
          created_at?: string;
          file_size?: number | null;
          file_url?: string;
          id?: string;
          mime_type?: string | null;
          name?: string;
          policy_id?: string | null;
          quote_id?: string | null;
          tags?: string[] | null;
          type?: string;
          updated_at?: string;
          uploaded_by?: string | null;
          version?: number;
        };
        Relationships: [
          {
            foreignKeyName: "documents_claim_id_fkey";
            columns: ["claim_id"];
            isOneToOne: false;
            referencedRelation: "claims";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "documents_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "documents_policy_id_fkey";
            columns: ["policy_id"];
            isOneToOne: false;
            referencedRelation: "policies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "documents_quote_id_fkey";
            columns: ["quote_id"];
            isOneToOne: false;
            referencedRelation: "quotes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "documents_uploaded_by_fkey";
            columns: ["uploaded_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      leads: {
        Row: {
          assigned_agent_id: string | null;
          converted_client_id: string | null;
          created_at: string;
          created_by: string | null;
          email: string | null;
          estimated_premium: number | null;
          first_name: string;
          id: string;
          interested_in: string[] | null;
          last_name: string;
          lead_id: string;
          notes: string | null;
          phone: string | null;
          source: string | null;
          stage: string;
          updated_at: string;
        };
        Insert: {
          assigned_agent_id?: string | null;
          converted_client_id?: string | null;
          created_at?: string;
          created_by?: string | null;
          email?: string | null;
          estimated_premium?: number | null;
          first_name: string;
          id?: string;
          interested_in?: string[] | null;
          last_name: string;
          lead_id: string;
          notes?: string | null;
          phone?: string | null;
          source?: string | null;
          stage?: string;
          updated_at?: string;
        };
        Update: {
          assigned_agent_id?: string | null;
          converted_client_id?: string | null;
          created_at?: string;
          created_by?: string | null;
          email?: string | null;
          estimated_premium?: number | null;
          first_name?: string;
          id?: string;
          interested_in?: string[] | null;
          last_name?: string;
          lead_id?: string;
          notes?: string | null;
          phone?: string | null;
          source?: string | null;
          stage?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "leads_assigned_agent_id_fkey";
            columns: ["assigned_agent_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "leads_converted_client_id_fkey";
            columns: ["converted_client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "leads_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      notifications: {
        Row: {
          created_at: string;
          id: string;
          link: string | null;
          message: string;
          read: boolean;
          title: string;
          type: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          link?: string | null;
          message: string;
          read?: boolean;
          title: string;
          type?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          link?: string | null;
          message?: string;
          read?: boolean;
          title?: string;
          type?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      policies: {
        Row: {
          assigned_agent_id: string | null;
          carrier_id: string;
          client_id: string;
          coverage_limit: number | null;
          created_at: string;
          created_by: string | null;
          deductible: number | null;
          description: string | null;
          effective_date: string;
          expiration_date: string;
          id: string;
          line_of_business: string;
          policy_number: string;
          premium: number;
          status: string;
          updated_at: string;
        };
        Insert: {
          assigned_agent_id?: string | null;
          carrier_id: string;
          client_id: string;
          coverage_limit?: number | null;
          created_at?: string;
          created_by?: string | null;
          deductible?: number | null;
          description?: string | null;
          effective_date: string;
          expiration_date: string;
          id?: string;
          line_of_business: string;
          policy_number: string;
          premium: number;
          status?: string;
          updated_at?: string;
        };
        Update: {
          assigned_agent_id?: string | null;
          carrier_id?: string;
          client_id?: string;
          coverage_limit?: number | null;
          created_at?: string;
          created_by?: string | null;
          deductible?: number | null;
          description?: string | null;
          effective_date?: string;
          expiration_date?: string;
          id?: string;
          line_of_business?: string;
          policy_number?: string;
          premium?: number;
          status?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "policies_assigned_agent_id_fkey";
            columns: ["assigned_agent_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "policies_carrier_id_fkey";
            columns: ["carrier_id"];
            isOneToOne: false;
            referencedRelation: "carriers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "policies_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "policies_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          agency_id: string | null;
          avatar_url: string | null;
          created_at: string;
          email: string;
          full_name: string;
          id: string;
          role: string;
          updated_at: string;
        };
        Insert: {
          agency_id?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          email: string;
          full_name: string;
          id: string;
          role?: string;
          updated_at?: string;
        };
        Update: {
          agency_id?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          email?: string;
          full_name?: string;
          id?: string;
          role?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_agency_id_fkey";
            columns: ["agency_id"];
            isOneToOne: false;
            referencedRelation: "agencies";
            referencedColumns: ["id"];
          },
        ];
      };
      quotes: {
        Row: {
          assigned_agent_id: string | null;
          carrier_id: string;
          client_id: string;
          coverage_limit: number | null;
          created_at: string;
          created_by: string | null;
          deductible: number | null;
          id: string;
          line_of_business: string;
          notes: string | null;
          premium: number | null;
          quote_number: string;
          status: string;
          updated_at: string;
          valid_until: string | null;
        };
        Insert: {
          assigned_agent_id?: string | null;
          carrier_id: string;
          client_id: string;
          coverage_limit?: number | null;
          created_at?: string;
          created_by?: string | null;
          deductible?: number | null;
          id?: string;
          line_of_business: string;
          notes?: string | null;
          premium?: number | null;
          quote_number: string;
          status?: string;
          updated_at?: string;
          valid_until?: string | null;
        };
        Update: {
          assigned_agent_id?: string | null;
          carrier_id?: string;
          client_id?: string;
          coverage_limit?: number | null;
          created_at?: string;
          created_by?: string | null;
          deductible?: number | null;
          id?: string;
          line_of_business?: string;
          notes?: string | null;
          premium?: number | null;
          quote_number?: string;
          status?: string;
          updated_at?: string;
          valid_until?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "quotes_assigned_agent_id_fkey";
            columns: ["assigned_agent_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "quotes_carrier_id_fkey";
            columns: ["carrier_id"];
            isOneToOne: false;
            referencedRelation: "carriers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "quotes_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "quotes_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      renewals: {
        Row: {
          assigned_agent_id: string | null;
          client_id: string;
          created_at: string;
          id: string;
          notes: string | null;
          policy_id: string;
          reminder_sent_at: string | null;
          renewal_date: string;
          status: string;
          updated_at: string;
        };
        Insert: {
          assigned_agent_id?: string | null;
          client_id: string;
          created_at?: string;
          id?: string;
          notes?: string | null;
          policy_id: string;
          reminder_sent_at?: string | null;
          renewal_date: string;
          status?: string;
          updated_at?: string;
        };
        Update: {
          assigned_agent_id?: string | null;
          client_id?: string;
          created_at?: string;
          id?: string;
          notes?: string | null;
          policy_id?: string;
          reminder_sent_at?: string | null;
          renewal_date?: string;
          status?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "renewals_assigned_agent_id_fkey";
            columns: ["assigned_agent_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "renewals_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "renewals_policy_id_fkey";
            columns: ["policy_id"];
            isOneToOne: false;
            referencedRelation: "policies";
            referencedColumns: ["id"];
          },
        ];
      };
      tasks: {
        Row: {
          assigned_to: string | null;
          client_id: string | null;
          created_at: string;
          created_by: string | null;
          description: string | null;
          due_date: string | null;
          id: string;
          policy_id: string | null;
          priority: string;
          status: string;
          title: string;
          type: string;
          updated_at: string;
        };
        Insert: {
          assigned_to?: string | null;
          client_id?: string | null;
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          due_date?: string | null;
          id?: string;
          policy_id?: string | null;
          priority?: string;
          status?: string;
          title: string;
          type?: string;
          updated_at?: string;
        };
        Update: {
          assigned_to?: string | null;
          client_id?: string | null;
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          due_date?: string | null;
          id?: string;
          policy_id?: string | null;
          priority?: string;
          status?: string;
          title?: string;
          type?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_to_fkey";
            columns: ["assigned_to"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tasks_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tasks_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tasks_policy_id_fkey";
            columns: ["policy_id"];
            isOneToOne: false;
            referencedRelation: "policies";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer Row;
    }
    ? Row
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer Row;
      }
      ? Row
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer Insert;
    }
    ? Insert
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer Insert;
      }
      ? Insert
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer Update;
    }
    ? Update
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer Update;
      }
      ? Update
      : never
    : never;
