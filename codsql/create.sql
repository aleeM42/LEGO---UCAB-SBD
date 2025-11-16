   create TABLE tours (
    tf_inicio date primary key,
    cupos number(4) not null,
    costo number(8,2) not null
);

create table paises (
    p_id number(4) primary key,
    p_nombre varchar2(30) not null,
    p_continente varchar2(30) not null,
    p_UE boolean not null,
    p_nacionalidad varchar2(30) not null
);

create table estados (
    e_id number(4) primary key,
    e_nombre varchar2(30) not null
);

create table ciudades (
    ciu_id number(4) primary key,
    ciu_nombre varchar2(30) not null
);

create table temas (
    t_id number(4) primary key,
    t_nombre varchar2(30) not null,
    t_tipo varchar2(10) not null,
    t_descripcion varchar2(100) not null,
    t_padreid number(4),
    constraint check_t_tipo check (t_tipo in ('SERIE', 'TEMA')),
    constraint fk_tpadreid foreign key (t_padreid) references temas(t_id),
    constraint u_t_nombre unique (t_nombre, t_padreid)
);

create table clientes (
    c_id number(4) primary key,
    c_pnombre varchar2(30) not null,
    c_papellido varchar2(30) not null,
    c_sapellido varchar2(30) not null,
    c_dni number(12) not null,
    c_fnacimiento date not null,
    c_numpas NUMBER(10),
    c_fvenpas date,
    c_snombre varchar2(30)
);
 
create table f_lego (
    fl_id number(4) primary key,
    fl_pnombre varchar2(30) not null,
    fl_papellido varchar2(30) not null,
    fl_sapellido varchar2(30) not null,
    fl_dni number(12) not null,
    fl_fnacimiento date not null,
    fl_numpas NUMBER(10),
    fl_fvenpas date,
    fl_snombre varchar2(30)
);        