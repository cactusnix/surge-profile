pub async fn generate_rules() {
  let url = "https://core.telegram.org/resources/cidr.txt";
  let resp = reqwest::get(url).await?;
}
