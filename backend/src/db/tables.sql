
drop table usr cascade;
drop table passwd cascade;
drop table conversation cascade;
drop table message cascade;
drop table conversation_usr cascade;

CREATE TABLE usr (
    id serial primary key,
    firstName character varying(128) NOT NULL,
    lastName character varying(128) NOT NULL,
    email character varying(128) NOT NULL,
    timestampCreated timestamp with time zone NOT NULL,
    timestampModified timestamp with time zone NOT NULL,
    active boolean NOT NULL,
    validated boolean NOT NULL
);

CREATE TABLE passwd (
    id serial primary key,
    id_usr integer references usr(id),
    salt character(32) NOT NULL,
    passwd character(256) NOT NULL,
    iter integer NOT NULL,
    timestampCreated timestamp with time zone NOT NULL,
    timestampModified timestamp with time zone NOT NULL
);

CREATE TABLE conversation (
	id bigserial primary key,
  name varchar(128),
  membersHash character(256) NOT NULL,
	timestampCreated timestamp with time zone NOT NULL,
	timestampModified timestamp with time zone NOT NULL,
	timestampLastMessage timestamp with time zone default NULL
);

CREATE TABLE message (
	id bigserial primary key,
	id_conversation bigint references conversation(id),
	id_sender integer references usr(id),
	timestampCreated timestamp with time zone NOT NULL,
	content varchar(16384) NOT NULL 
);

CREATE TABLE conversation_usr (
  id bigserial primary key,
  id_conversation bigint references conversation(id),
  id_usr integer references usr(id),
  timestampLastMessage timestamp with time zone default NULL,
  timestampLastRead timestamp with time zone default NULL,
  numUnreadMessages integer default 0 
);



--
-- Stored Procedures (Functions)
--
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
  INSERT INTO usr(firstname, lastname, email, timestampCreated, timestampModified, active, validated)
	VALUES (firstname, lastname, email, curtime, curtime, true, false)
  RETURNING id INTO myid;
  -- Insert password information
  INSERT INTO passwd( id_usr, salt, passwd, iter, timestampCreated, timestampModified)
  VALUES (myid,salt,encrypted_password,crypt_iters, curtime, curtime);
  -- return newly-created user's id 
  RETURN myid;
END
$$
LANGUAGE 'plpgsql';


<<<<<<< HEAD
=======
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
>>>>>>> 14d6644022d0d681cb7cbc67cd4322edd6ef18cc


-- select * from usr;
--drop table passwd;
--drop table usr;
