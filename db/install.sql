-- report supporting tables
drop table users;
create table users (
  id serial primary key,
  cn text not null,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone_number text not null
);

insert
  into users(id, cn, first_name, last_name, email, phone_number)
values (1, 'client1', 'Client', '1', 'client1@example.com', '555-555-5555');

drop table signup;
create table signup (
  id serial primary key,
  cn text not null,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone_number text not null
);
