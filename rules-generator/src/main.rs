use std::error::Error;
mod modules;

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
  let modules::telegram::generate_rules().await;
  Ok(())
}
