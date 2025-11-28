CREATE TABLE public.law_firms (
	id bigserial NOT NULL,
	"name" varchar(150) NOT NULL,
	nif varchar(9) NULL,
	email varchar(50) NULL,
	phone varchar(50) NULL,
	is_active bool DEFAULT true NOT NULL,
	created_at timestamp DEFAULT now() NOT NULL,
	slug text NOT NULL,
	CONSTRAINT law_firms_pkey PRIMARY KEY (id),
	CONSTRAINT law_firms_slug_key UNIQUE (slug)
);


CREATE TABLE public.permissions (
	id bigserial NOT NULL,
	code varchar(100) NOT NULL,
	description text NULL,
	CONSTRAINT permissions_code_key UNIQUE (code),
	CONSTRAINT permissions_pkey PRIMARY KEY (id)
);



CREATE TABLE public.clients (
	id bigserial NOT NULL,
	law_firm_id int8 NOT NULL,
	full_name varchar(150) NOT NULL,
	nif varchar(50) NULL,
	date_of_birth date NULL,
	phone varchar(50) NULL,
	email varchar(150) NULL,
	is_minor bool DEFAULT false NOT NULL,
	guardian_name varchar(150) NULL,
	guardian_contact varchar(150) NULL,
	notes text NULL,
	created_at timestamp DEFAULT now() NOT NULL,
	service_type text NULL,
	passport_number text NULL,
	address text NULL,
	postal_code text NULL,
	nationality text NULL,
	status text DEFAULT 'pending'::text NULL,
	sources text DEFAULT 'public_form'::text NULL,
	CONSTRAINT clients_pkey PRIMARY KEY (id),
	CONSTRAINT clients_law_firm_id_fkey FOREIGN KEY (law_firm_id) REFERENCES public.law_firms(id) ON DELETE CASCADE
);
CREATE INDEX idx_clients_law_firm_id ON public.clients USING btree (law_firm_id);


CREATE TABLE public.roles (
	id bigserial NOT NULL,
	code varchar(50) NOT NULL,
	"name" varchar(100) NOT NULL,
	description text NULL,
	hierarchy_group varchar(50) NULL,
	"level" int4 NOT NULL,
	parent_role_id int8 NULL,
	CONSTRAINT roles_code_key UNIQUE (code),
	CONSTRAINT roles_pkey PRIMARY KEY (id),
	CONSTRAINT roles_parent_role_id_fkey FOREIGN KEY (parent_role_id) REFERENCES public.roles(id)
);


CREATE TABLE public.users (
	id bigserial NOT NULL,
	law_firm_id int8 NOT NULL,
	"name" varchar(150) NOT NULL,
	email varchar(150) NOT NULL,
	password_hash text NULL,
	user_type varchar(20) NOT NULL,
	is_active bool DEFAULT true NOT NULL,
	last_login_at timestamp NULL,
	created_at timestamp DEFAULT now() NOT NULL,
	"role" varchar(50) NULL,
	invite_token text NULL,
	invite_expires_at timestamp NULL,
	CONSTRAINT users_email_key UNIQUE (email),
	CONSTRAINT users_pkey PRIMARY KEY (id),
	CONSTRAINT users_law_firm_id_fkey FOREIGN KEY (law_firm_id) REFERENCES public.law_firms(id) ON DELETE CASCADE
);
CREATE INDEX idx_users_invite_token ON public.users USING btree (invite_token);
CREATE INDEX idx_users_law_firm_id ON public.users USING btree (law_firm_id);


CREATE TABLE public.cases (
	id bigserial NOT NULL,
	law_firm_id int8 NOT NULL,
	client_id int8 NOT NULL,
	case_number varchar(100) NULL,
	case_type varchar(100) NULL,
	court varchar(150) NULL,
	comarca varchar(150) NULL,
	status varchar(50) DEFAULT 'EM_ANDAMENTO'::character varying NOT NULL,
	responsible_user_id int8 NULL,
	description text NULL,
	opened_at timestamp DEFAULT now() NOT NULL,
	closed_at timestamp NULL,
	CONSTRAINT cases_pkey PRIMARY KEY (id),
	CONSTRAINT cases_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id),
	CONSTRAINT cases_law_firm_id_fkey FOREIGN KEY (law_firm_id) REFERENCES public.law_firms(id) ON DELETE CASCADE,
	CONSTRAINT cases_responsible_user_id_fkey FOREIGN KEY (responsible_user_id) REFERENCES public.users(id)
);


CREATE TABLE public.documents (
	id bigserial NOT NULL,
	law_firm_id int8 NOT NULL,
	case_id int8 NULL,
	client_id int8 NULL,
	uploaded_by_user_id int8 NULL,
	document_type varchar(50) NULL,
	title varchar(150) NULL,
	original_filename varchar(255) NULL,
	storage_path text NOT NULL,
	status varchar(30) DEFAULT 'RECEBIDO'::character varying NULL,
	notes text NULL,
	created_at timestamp DEFAULT now() NOT NULL,
	updated_at timestamp NULL,
	CONSTRAINT documents_pkey PRIMARY KEY (id),
	CONSTRAINT documents_case_id_fkey FOREIGN KEY (case_id) REFERENCES public.cases(id) ON DELETE SET NULL,
	CONSTRAINT documents_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE SET NULL,
	CONSTRAINT documents_law_firm_id_fkey FOREIGN KEY (law_firm_id) REFERENCES public.law_firms(id) ON DELETE CASCADE,
	CONSTRAINT documents_uploaded_by_user_id_fkey FOREIGN KEY (uploaded_by_user_id) REFERENCES public.users(id)
);


CREATE TABLE public.notifications (
	id bigserial NOT NULL,
	law_firm_id int8 NOT NULL,
	user_id int8 NULL,
	client_id int8 NULL,
	"type" varchar(50) NULL,
	subject varchar(150) NULL,
	message text NULL,
	status varchar(30) DEFAULT 'ENVIADO'::character varying NULL,
	created_at timestamp DEFAULT now() NOT NULL,
	CONSTRAINT notifications_pkey PRIMARY KEY (id),
	CONSTRAINT notifications_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id),
	CONSTRAINT notifications_law_firm_id_fkey FOREIGN KEY (law_firm_id) REFERENCES public.law_firms(id) ON DELETE CASCADE,
	CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);


CREATE TABLE public.payment_plans (
	id bigserial NOT NULL,
	law_firm_id int8 NOT NULL,
	client_id int8 NOT NULL,
	case_id int8 NULL,
	total_amount numeric(12, 2) NOT NULL,
	currency varchar(10) DEFAULT 'EUR'::character varying NULL,
	start_date date NOT NULL,
	status varchar(30) DEFAULT 'ATIVO'::character varying NOT NULL,
	notes text NULL,
	created_at timestamp DEFAULT now() NOT NULL,
	CONSTRAINT payment_plans_pkey PRIMARY KEY (id),
	CONSTRAINT payment_plans_case_id_fkey FOREIGN KEY (case_id) REFERENCES public.cases(id),
	CONSTRAINT payment_plans_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id),
	CONSTRAINT payment_plans_law_firm_id_fkey FOREIGN KEY (law_firm_id) REFERENCES public.law_firms(id) ON DELETE CASCADE
);


CREATE TABLE public.role_permissions (
	role_id int8 NOT NULL,
	permission_id int8 NOT NULL,
	CONSTRAINT role_permissions_pkey PRIMARY KEY (role_id, permission_id),
	CONSTRAINT role_permissions_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES public.permissions(id) ON DELETE CASCADE,
	CONSTRAINT role_permissions_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE
);


CREATE TABLE public.user_roles (
	user_id int8 NOT NULL,
	role_id int8 NOT NULL,
	CONSTRAINT user_roles_pkey PRIMARY KEY (user_id, role_id),
	CONSTRAINT user_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE,
	CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);


CREATE TABLE public.case_events (
	id bigserial NOT NULL,
	law_firm_id int8 NOT NULL,
	case_id int8 NOT NULL,
	event_type varchar(100) NULL,
	description text NOT NULL,
	created_by_user_id int8 NULL,
	visible_to_client bool DEFAULT true NOT NULL,
	created_at timestamp DEFAULT now() NOT NULL,
	CONSTRAINT case_events_pkey PRIMARY KEY (id),
	CONSTRAINT case_events_case_id_fkey FOREIGN KEY (case_id) REFERENCES public.cases(id) ON DELETE CASCADE,
	CONSTRAINT case_events_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES public.users(id),
	CONSTRAINT case_events_law_firm_id_fkey FOREIGN KEY (law_firm_id) REFERENCES public.law_firms(id) ON DELETE CASCADE
);


CREATE TABLE public.payment_installments (
	id bigserial NOT NULL,
	payment_plan_id int8 NOT NULL,
	law_firm_id int8 NOT NULL,
	installment_number int4 NOT NULL,
	due_date date NOT NULL,
	amount numeric(12, 2) NOT NULL,
	status varchar(30) DEFAULT 'PENDENTE'::character varying NOT NULL,
	paid_at timestamp NULL,
	payment_method varchar(50) NULL,
	reference_info varchar(255) NULL,
	CONSTRAINT payment_installments_pkey PRIMARY KEY (id),
	CONSTRAINT payment_installments_law_firm_id_fkey FOREIGN KEY (law_firm_id) REFERENCES public.law_firms(id) ON DELETE CASCADE,
	CONSTRAINT payment_installments_payment_plan_id_fkey FOREIGN KEY (payment_plan_id) REFERENCES public.payment_plans(id) ON DELETE CASCADE
);
