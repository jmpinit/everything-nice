extern crate libc;

use std::ffi::{CString, CStr};
use libc::{c_int, c_char, malloc};
use std::mem::forget;

use std::io;
use std::io::prelude::*;

#[repr(C)]
struct SpiceContext {
    a: i32
}

#[link(name = "ngspice")]
extern {
    fn ngSpice_Init(
            send_char: extern fn(c: *mut c_char, id: c_int, ctx: *mut SpiceContext),
            b: c_int,//sendStat: extern fn(),
            controlled_exit: extern fn(status: c_int, unloading: bool, exit_type: bool, id: c_int, ctx: *mut SpiceContext),
            d: c_int,//sendData: extern fn()
            e: c_int,//sendInitData: extern fn()
            //bgThreadRunning: extern fn()) -> int_c;
            g: c_int) -> c_int;
    fn ngSpice_Command(command: *const c_char);
    fn ngSpice_running() -> bool;
}

extern fn send_char(c: *mut c_char, id: c_int, ctx: *mut SpiceContext) {
    let s = unsafe {
        CString::from_raw(c)
    };
    println!("{:?}", s);
    forget(s); // otherwise malloc from ngspice fails
}

extern fn controlled_exit(status: c_int, unloading: bool, exit_type: bool, id: c_int, ctx: *mut SpiceContext) {
    println!("ngspice did a controlled exit!");
}

/*extern fn sendStat() {
}

extern fn sendStat() {
}

extern fn sendStat() {
}

extern fn sendStat() {
}*/

fn spiceit(cmd: &CString) {
    unsafe {
        ngSpice_Command(cmd.as_ptr());
    }
}

fn main() {
    unsafe { ngSpice_Init(send_char, 0, controlled_exit, 0, 0, 0); }

    let stdin = io::stdin();
    for line in stdin.lock().lines() {
        spiceit(&CString::new(line.unwrap()).unwrap());
    }
}
