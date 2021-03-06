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
  std::vector<std::string> min_files{
    "./license-header.js",
    "./geo/Directions.js",
    "./geo/Vector.js",
    "./geo/Vector2d.js",
    "./Counters.js",
    "./State.js",
    "./action/Action.js",
    "./action/Keyboard.js",
    "./action/MouseButton.js",
    "./action/Mouse.js",
    "./action/ActionManager.js",
    "./resource/SoundType.js",
    "./resource/SoundManager.js",
    "./resource/ImageManager.js",
    "./painter/Painter.js",
    "./painter/Painter2D.js",
    "./scene/Transition.js",
    "./scene/Scene.js",
    "./scene/Scenes.js",
    "./logger/LogLevel.js",
    "./logger/Logger.js",
    "./recorder/KeycodeBiDiMap.js",
    "./recorder/SHA256.js",
    "./recorder/Recorder.js",
    "./Game.js",
  };
  std::vector<std::string> opt_files{
    "./figure/Material.js",
    "./figure/PhysicalType.js",
    "./figure/Shape2d.js",
    "./figure/Rect2d.js",
    "./figure/Circle2d.js",
    "./figure/Rigid2d.js",
    "./util/KoturnoUtil.js",
    "./util/StdTransFunc.js",
    "./util/Tween.js",
  };
  std::string koturno_min_file_path = "../koturno-min.js";
  std::string koturno_all_file_path = "../koturno-all.js";
  clean_file(koturno_min_file_path);
  clean_file(koturno_all_file_path);

  std::ofstream min_ofs(koturno_min_file_path, std::ios::out | std::ios::app);
  std::ofstream all_ofs(koturno_all_file_path, std::ios::out | std::ios::app);
  std::string buf;

  for (auto itr = min_files.cbegin(); itr != min_files.cend(); ++itr) {
    std::ifstream ifs(*itr);
    if (!ifs) {
      std::cerr << "Failed to open a file." << std::endl;
      return 1;
    } else {
      while (getline(ifs, buf)) {
        min_ofs << buf << std::endl;
        all_ofs << buf << std::endl;
      }
      min_ofs << std::endl;
      all_ofs << std::endl;
    }
  }

  for (auto itr = opt_files.cbegin(); itr != opt_files.cend(); ++itr) {
    std::ifstream ifs(*itr);
    if (!ifs) {
      std::cerr << "Failed to open a file." << std::endl;
      return 1;
    } else {
      while (getline(ifs, buf)) {
        all_ofs << buf << std::endl;
      }
      all_ofs << std::endl;
    }
  }
  return 0;
}
