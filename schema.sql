create table  user(
    id varchar(50) primary key,
    username varchar(50) unique,
   email varchar(50) unique,
   password varchar(50) not null

)