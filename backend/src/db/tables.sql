
CREATE TABLE usr (
    id serial primary key,
    firstname character varying(128) NOT NULL,
    lastname character varying(128) NOT NULL,
    email character varying(128) NOT NULL,
    timestampcreated timestamp with time zone NOT NULL,
    timestampmodified timestamp with time zone NOT NULL,
    active boolean NOT NULL,
    validated boolean NOT NULL
);

CREATE TABLE public.passwd (
    id serial primary key,
    idusr integer references usr(id),
    salt character(32) NOT NULL,
    passwd character(256) NOT NULL,
    iter integer NOT NULL,
    timestampcreated timestamp with time zone NOT NULL,
    timestampmodified timestamp with time zone NOT NULL
);

CREATE TABLE audience (
	id bigserial primary key,
	timestampcreated timestamp with time zone NOT NULL,
	membershash character(128) NOT NULL 
);

CREATE TABLE audience_usr (
	id_audience bigint references audience(id),
	id_usr integer references usr(id)
);

CREATE TABLE conversation (
	id bigserial primary key,
	idowner integer references usr(id),
	idaudience bigint references audience(id),
	timestampcreated timestamp with time zone NOT NULL,
	timestampmodified timestamp with time zone NOT NULL
);

CREATE TABLE message (
	id bigserial primary key,
	id_conversation bigint references conversation(id),
	id_sender integer references usr(id),
	timestampcreated timestamp with time zone NOT NULL,
	content varchar(16384) NOT NULL 
);

CREATE OR REPLACE FUNCTION createUser(
	firstname varchar, 
	lastname varchar, 
	email varchar, 
	salt varchar,
	encrypted_password varchar, 
	crypt_iters integer
)
RETURNS usr.id%TYPE 
AS $$
DECLARE myid usr.id%TYPE;
DECLARE curtime timestamptz = current_timestamp;
BEGIN
  -- Insert the user 
  INSERT INTO usr(firstname, lastname, email, timestampcreated, timestampmodified, active, validated)
	VALUES (firstname, lastname, email, curtime, curtime, true, false)
  RETURNING id INTO myid;
  -- Insert password information
  INSERT INTO passwd( idusr, salt, passwd, iter, timestampcreated, timestampmodified)
  VALUES (myid,salt,encrypted_password,crypt_iters, curtime, curtime);
  -- return newly-created user's id 
  RETURN myid;
END
$$
LANGUAGE 'plpgsql';


-- Get a user's audiences with members listed 
select 
	au.id_audience as audience_id, 
	u.id as user_id,
	u.email as user_email 
from usr as u
	inner join audience_usr as au on u.id = au.id_usr
where 
	au.id_audience in (
		select a.id 
		from audience as a
   			inner join audience_usr as au ON a.id = au.id_audience
   			where au.id_usr = 1
	)

  -- Get the members of an audience
select
  *
from usr as u 
  inner join audience_usr as au on u.id = au.id_usr
where
  au.id_audience = 1



  -- Get a user's conversations
select 
	c.* 
from conversation as c
	inner join audience a on a.id = c.idaudience
where 
	a.id in (
		select a.id 
		from audience as a
   			inner join audience_usr as au ON a.id = au.id_audience
   			where au.id_usr = 1
	)


-- select * from usr;
--drop table passwd;
--drop table usr;
