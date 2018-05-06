
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


select * from usr;

--drop table passwd;
--drop table usr;
