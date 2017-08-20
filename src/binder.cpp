#include <iostream>
#include <fstream>
#include <string>
#include <vector>

void clean_file(std::string path) {
  std::ofstream cl;
  cl.open(path);
  cl.close();
}

int main(int argc, char const *argv[]) {
  std::vector<std::string> files{
    "./license-header.js",
    "./Counters.js",
    "./State.js",
    "./ActionManager.js",
    "./SoundManager.js",
    "./ImageManager.js",
    "./Painter.js",
    "./Transition.js",
    "./Scene.js",
    "./Scenes.js",
    "./Game.js",
  };
  std::string output_file_path = (argc > 1) ? argv[1] : "../koturno-all.js"; // 出力先を変更可能
  clean_file(output_file_path); // ファイルを一旦空にする

  std::ofstream ofs(output_file_path, std::ios::out | std::ios::app); // 追記モードで書き込む
  std::string buf;

  for (auto itr = files.begin(); itr != files.end(); ++itr) {
    std::ifstream ifs(*itr);
    if (!ifs) {
      std::cerr << "Failed to open a file." << std::endl;
      return 1;
    } else {
      while (getline(ifs, buf)) {
        ofs << buf << std::endl;
      }
      ofs << std::endl;
    }
  }
  return 0;
}
