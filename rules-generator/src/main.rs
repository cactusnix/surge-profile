use jsonc_parser::parse_to_serde_value;
use std::fs;

fn main() {
  let path = "./assets/openai.jsonc";
  let openai: String = fs::read_to_string(path).expect("A");
  // let a = parse_to_serde_value(openai.match, &Default::default());
  println!("{:?}", openai);
  Ok(());
  // match a {
  //   Ok(value) => {
  //   },
  //           Err(e) {
  //           eprintln!("DD")
  //       }
  // }
}
