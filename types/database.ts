export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          title: string;
          description: string;
          tech_stack: string[];
          image_url: string | null;
          is_published: boolean;
          order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          tech_stack?: string[];
          image_url?: string | null;
          is_published?: boolean;
          order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          tech_stack?: string[];
          image_url?: string | null;
          is_published?: boolean;
          order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      achievements: {
        Row: {
          id: string;
          title: string;
          description: string;
          issuer: string;
          achieved_at: string | null;
          image_url: string | null;
          is_published: boolean;
          order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          issuer: string;
          achieved_at?: string | null;
          image_url?: string | null;
          is_published?: boolean;
          order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          issuer?: string;
          achieved_at?: string | null;
          image_url?: string | null;
          is_published?: boolean;
          order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      experience: {
        Row: {
          id: string;
          company: string;
          role: string;
          summary: string;
          location: string;
          start_date: string;
          end_date: string | null;
          image_url: string | null;
          is_published: boolean;
          order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company: string;
          role: string;
          summary: string;
          location: string;
          start_date: string;
          end_date?: string | null;
          image_url?: string | null;
          is_published?: boolean;
          order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company?: string;
          role?: string;
          summary?: string;
          location?: string;
          start_date?: string;
          end_date?: string | null;
          image_url?: string | null;
          is_published?: boolean;
          order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      layout_config: {
        Row: {
          id: number;
          sections: Json;
          updated_at: string;
        };
        Insert: {
          id?: number;
          sections: Json;
          updated_at?: string;
        };
        Update: {
          id?: number;
          sections?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };
      theme_config: {
        Row: {
          id: number;
          primary_color: string;
          secondary_color: string;
          tertiary_color: string;
          font_family: string;
          hero_video_url: string | null;
          hero_video_opacity: number;
          updated_at: string;
        };
        Insert: {
          id?: number;
          primary_color: string;
          secondary_color: string;
          tertiary_color?: string;
          font_family: string;
          hero_video_url?: string | null;
          hero_video_opacity?: number;
          updated_at?: string;
        };
        Update: {
          id?: number;
          primary_color?: string;
          secondary_color?: string;
          tertiary_color?: string;
          font_family?: string;
          hero_video_url?: string | null;
          hero_video_opacity?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      admin_config: {
        Row: {
          id: number;
          admin_email: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          admin_email: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          admin_email?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
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
