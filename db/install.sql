-- report supporting tables
drop table users;
create table users (
  id integer primary key,
  cn text not null,
  first_name text not null,
  last_name text not null
);

insert into users values(1, 'client1', 'Client', '1');
