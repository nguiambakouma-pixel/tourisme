-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.experiences (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  title text NOT NULL,
  description text,
  price text,
  duration text,
  category text,
  badge text,
  badge_color text,
  image text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT experiences_pkey PRIMARY KEY (id)
);
CREATE TABLE public.accommodations (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  title text NOT NULL,
  type text,
  price text,
  rating numeric,
  reviews integer,
  features ARRAY,
  image text,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT accommodations_pkey PRIMARY KEY (id)
);
CREATE TABLE public.blog_posts (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  title text NOT NULL,
  excerpt text,
  content text,
  category text,
  date text,
  read_time text,
  image text,
  author text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT blog_posts_pkey PRIMARY KEY (id)
);
CREATE TABLE public.gallery_images (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  src text NOT NULL,
  alt text,
  cat text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT gallery_images_pkey PRIMARY KEY (id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  role text NOT NULL DEFAULT 'customer'::text CHECK (role = ANY (ARRAY['admin'::text, 'customer'::text])),
  full_name text,
  phone text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.reservations (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  user_id uuid NOT NULL,
  items jsonb NOT NULL,
  total numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending'::text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT reservations_pkey PRIMARY KEY (id),
  CONSTRAINT reservations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
